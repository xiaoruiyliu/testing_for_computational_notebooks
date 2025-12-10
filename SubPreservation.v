(* Helper lemmas for pair inversion *)

(** Inversion lemma for pairs - needed for ST_FstPair and ST_SndPair cases *)
Lemma typing_inversion_pair : forall Gamma v1 v2 T,
    value v1 -> value v2 ->
    <{ Gamma |-- (v1, v2) \in T }> ->
    exists S1 S2,
      <{ Gamma |-- v1 \in S1 }> /\
      <{ Gamma |-- v2 \in S2 }> /\
      <{{ S1 * S2 }}> <: T.
Proof with eauto.
  intros Gamma v1 v2 T Hv1 Hv2 HT.
  remember (tm_pair v1 v2) as t eqn:Heqt.
  induction HT; try discriminate.
  - (* T_Pair *)
    injection Heqt as -> ->.
    exists T1, T2. split... split...
    apply S_Refl.
  - (* T_Sub *)
    destruct (IHHT Heqt) as [S1 [S2 [HS1 [HS2 HSub]]]].
    exists S1, S2. split... split...
    eapply S_Trans...
Qed.

(** Inversion lemma for fst projection - extracts first component type *)
Lemma typing_inversion_fst : forall Gamma t T,
    <{ Gamma |-- t.fst \in T }> ->
    exists T1 T2,
      <{ Gamma |-- t \in T1 * T2 }> /\
      T1 <: T.
Proof with eauto.
  intros Gamma t T HT.
  remember (tm_fst t) as tfst eqn:Heqt.
  induction HT; try discriminate.
  - (* T_Fst *)
    injection Heqt as ->.
    exists T1, T2. split...
    apply S_Refl.
  - (* T_Sub *)
    destruct (IHHT Heqt) as [T1' [T2' [Ht Hsub]]].
    exists T1', T2'. split...
    eapply S_Trans...
Qed.

(** Inversion lemma for snd projection - extracts second component type *)
Lemma typing_inversion_snd : forall Gamma t T,
    <{ Gamma |-- t.snd \in T }> ->
    exists T1 T2,
      <{ Gamma |-- t \in T1 * T2 }> /\
      T2 <: T.
Proof with eauto.
  intros Gamma t T HT.
  remember (tm_snd t) as tsnd eqn:Heqt.
  induction HT; try discriminate.
  - (* T_Snd *)
    injection Heqt as ->.
    exists T1, T2. split...
    apply S_Refl.
  - (* T_Sub *)
    destruct (IHHT Heqt) as [T1' [T2' [Ht Hsub]]].
    exists T1', T2'. split...
    eapply S_Trans...
Qed.

(** Subtyping inversion for product types *)
Lemma sub_inversion_prod : forall S1 S2 T,
    <{{ S1 * S2 }}> <: T ->
    (T = <{{ Top }}>) \/
    (exists T1 T2, T = <{{ T1 * T2 }}> /\ S1 <: T1 /\ S2 <: T2).
Proof with eauto.
  intros S1 S2 T Hsub.
  remember (ty_prod S1 S2) as S eqn:HeqS.
  generalize dependent S2. generalize dependent S1.
  induction Hsub; intros S1' S2' HeqS; subst.
  - (* S_Refl *)
    right. exists S1', S2'. split... split...
  - (* S_Trans *)
    destruct U; try (left; reflexivity).
    + (* U = Top *)
      destruct (IHHsub1 S1' S2' eq_refl).
      * subst. inversion Hsub2.
      * left. reflexivity.
    + (* U = Prod U1 U2 *)
      destruct (IHHsub1 S1' S2' eq_refl).
      * discriminate.
      * destruct H as [T1' [T2' [Heq [Hsub1' Hsub2']]]].
        injection Heq as -> ->.
        inversion Hsub2; subst.
        -- right. exists U1, U2. split... split...
        -- (* S_Trans case *)
           destruct (IHHsub2 U1 U2 eq_refl).
           ++ left. reflexivity.
           ++ destruct H as [T1'' [T2'' [Heq [HsubT1 HsubT2]]]].
              right. exists T1'', T2''. split...
              split; eapply S_Trans...
        -- right. exists <{{ Top }}>, <{{ Top }}>. split... split...
           apply S_Top. apply S_Top.
        -- right. exists T1, T2. split... split; eapply S_Trans...
  - (* S_Top *)
    left. reflexivity.
  - (* S_Arrow *)
    discriminate.
  - (* S_Prod *)
    right. exists T1, T2. split... split...
Qed.

(* ================================================================= *)
(** ** Preservation *)

Theorem preservation : forall t t' T,
     <{ empty |-- t \in T }> ->
     t --> t'  ->
     <{ empty |-- t' \in T }>.
Proof with eauto.
  intros t t' T HT. generalize dependent t'.
  remember empty as Gamma.
  induction HT;
       intros t' HE; subst;
       try solve [inversion HE; subst; eauto].
  - (* T_App *)
    inversion HE; subst...
    (* Most of the cases are immediate by induction,
       and [eauto] takes care of them *)
    + (* ST_AppAbs *)
      destruct (abs_arrow _ _ _ _ _ HT1) as [HA1 HA2].
      apply substitution_preserves_typing with T0...
  - (* T_Fst *)
    inversion HE; subst...
    + (* ST_FstPair *)
      (* We have: empty |- (v1, v2) : T1 * T2 *)
      (* Need to show: empty |- v1 : T1 *)
      destruct (typing_inversion_pair _ _ _ _ H H0 HT) 
        as [S1 [S2 [HS1 [HS2 HSub]]]].
      (* Now we have: S1 * S2 <: T1 * T2 *)
      destruct (sub_inversion_prod _ _ _ HSub) as [HTop | [T1' [T2' [Heq [HsubT1 HsubT2]]]]].
      * (* Case: T1 * T2 = Top - contradiction *)
        discriminate HTop.
      * (* Case: T1 * T2 = T1' * T2' and S1 <: T1', S2 <: T2' *)
        injection Heq as -> ->.
        apply T_Sub with S1...
  - (* T_Snd *)
    inversion HE; subst...
    + (* ST_SndPair *)
      (* We have: empty |- (v1, v2) : T1 * T2 *)
      (* Need to show: empty |- v2 : T2 *)
      destruct (typing_inversion_pair _ _ _ _ H H0 HT) 
        as [S1 [S2 [HS1 [HS2 HSub]]]].
      (* Now we have: S1 * S2 <: T1 * T2 *)
      destruct (sub_inversion_prod _ _ _ HSub) as [HTop | [T1' [T2' [Heq [HsubT1 HsubT2]]]]].
      * (* Case: T1 * T2 = Top - contradiction *)
        discriminate HTop.
      * (* Case: T1 * T2 = T1' * T2' and S1 <: T1', S2 <: T2' *)
        injection Heq as -> ->.
        apply T_Sub with S2...
  - (* T_Sub *)
    (* If Gamma |- t : T1 and T1 <: T2 and t --> t',
       then by IH, Gamma |- t' : T1, 
       so by T_Sub, Gamma |- t' : T2 *)
    apply T_Sub with T1...
Qed.

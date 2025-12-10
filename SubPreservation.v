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

(** Direct inversion lemmas for pair typing *)

Lemma pair_has_type_fst : forall Gamma v1 v2 T1 T2,
    value v1 -> value v2 ->
    <{ Gamma |-- (v1, v2) \in T1 * T2 }> ->
    <{ Gamma |-- v1 \in T1 }>.
Proof with eauto.
  intros Gamma v1 v2 T1 T2 Hv1 Hv2 HT.
  remember (tm_pair v1 v2) as t eqn:Heqt.
  remember (ty_prod T1 T2) as T eqn:HeqT.
  generalize dependent T2. generalize dependent T1.
  generalize dependent v2. generalize dependent v1.
  induction HT; intros; try discriminate.
  - (* T_Pair *)
    injection Heqt as -> ->. injection HeqT as -> ->.
    assumption.
  - (* T_Sub *)
    subst T0.
    destruct T1; try discriminate.
    injection HeqT as -> ->.
    apply T_Sub with T1_1.
    + apply IHHT with v2... 
    + inversion H; subst...
Qed.

Lemma pair_has_type_snd : forall Gamma v1 v2 T1 T2,
    value v1 -> value v2 ->
    <{ Gamma |-- (v1, v2) \in T1 * T2 }> ->
    <{ Gamma |-- v2 \in T2 }>.
Proof with eauto.
  intros Gamma v1 v2 T1 T2 Hv1 Hv2 HT.
  remember (tm_pair v1 v2) as t eqn:Heqt.
  remember (ty_prod T1 T2) as T eqn:HeqT.
  generalize dependent T2. generalize dependent T1.
  generalize dependent v2. generalize dependent v1.
  induction HT; intros; try discriminate.
  - (* T_Pair *)
    injection Heqt as -> ->. injection HeqT as -> ->.
    assumption.
  - (* T_Sub *)
    subst T0.
    destruct T1; try discriminate.
    injection HeqT as -> ->.
    apply T_Sub with T1_2.
    + apply IHHT with v1...
    + inversion H; subst...
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
      (* Direct application - no subtyping inversion needed *)
      eapply pair_has_type_fst; eauto.
  - (* T_Snd *)
    inversion HE; subst...
    + (* ST_SndPair *)
      (* Direct application - no subtyping inversion needed *)
      eapply pair_has_type_snd; eauto.
  - (* T_Sub *)
    (* If Gamma |- t : T1 and T1 <: T2 and t --> t',
       then by IH, Gamma |- t' : T1, 
       so by T_Sub, Gamma |- t' : T2 *)
    apply T_Sub with T1...
Qed.

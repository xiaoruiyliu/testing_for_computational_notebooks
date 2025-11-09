# Testing for computational notebooks
An extension for Jupyter Notebooks that supports a novel testing interaction in computational notebooks.

## Source attribution

This system was created using the Cursor IDE, which has an embedded AI-backed programming tool that I used. To get familiar with creating a custom Jupyter Notebook extension, I referenced [this](https://aneesha.medium.com/creating-a-jupyter-notebook-extension-part-1-31c72032cad) resource by Aneesha Bakharia.

## Running a Custom Jupyter Notebook Extension

Apologies to the unlucky grader in advance, but running a custom extension will require some set-up. Feel free to email me at xrl@seas.upenn.edu so I can show the extension on my system if you run into any issues. This installation guide follows the resource linked above.

### 1) Create a new conda virtual environment 
```
$ conda create --name jupyterexperiments python=3.11 
$ conda activate jupyterexperiments
$ conda install -c conda-forge jupyter_contrib_nbextensions
```

### 2) Find the extensions directory
```
$ pip show jupyter_contrib_nbextensions
```
This shows you where the package is installed. Look for the `Location:` line in the output.
```
# Your File Structure Should Look Like This:
/Users/username/anaconda3/envs/jupyterexperiments/lib/python3.11/site-packages/
└── jupyter_contrib_nbextensions/
    └── nbextensions/                                         ← CLONE THIS REPOSITORY HERE
        └── testing_for_computational_notebooks/             
            └── main.js
            └── ...                   
```

### 3) Install and enable the extension
Navigate to the nbextensions folder. Then, run the following: 
```
$ jupyter nbextension install testing_for_computational_notebooks --user
$ jupyter nbextension enable testing_for_computational_notebooks/main
```

### 4) Open a notebook
Then, open a notebook. This can be done through a locally hosted notebook by clicking the "New --> Python 3 (ipykernel)" widget.
```
$ jupyter notebook
```

You should see the widgets that enable the modifications present in the submitted video. The functionalities are in accordance with the Technical Requirements list [here](https://docs.google.com/document/d/1HsXkMyFKSORycitlkBDmf4F8iTz5vP_hsKciUOxg03g/edit?usp=sharing). 

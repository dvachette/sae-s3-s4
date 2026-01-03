import tkinter as tk
from tkinter import ttk

class SelectorUtility(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Selector Utility")
        self.geometry("600x700")

        self.mandatEnabled = tk.BooleanVar()
        self.poleEnabled = tk.BooleanVar()
        self.hpEnabled = tk.BooleanVar()
        self.excludeMandat = tk.BooleanVar()
        self.excludePole = tk.BooleanVar()
        self.selectorOutputVar = tk.StringVar()


        # Combobox to chose between (toutes les cartes, carte active de l'utilisateur, carte active de l'adversaire, ...)
        self.filterLabel = tk.Label(self, text="Selectionez les cartes à affecter :")
        self.filterLabel.pack(pady=10)
        self.filterCombo = ttk.Combobox(self, values=[
            "Toutes les cartes en jeu",
            "Carte active du joueur",
            "Carte active de l'adversaire",
            "Cartes dans la main du joueur",
            "Cartes dans la main de l'adversaire",
            "Toutes les cartes du joueur",
            "Toutes les cartes de l'adversaire"
        ], state="readonly", width=40)
        self.filterCombo.current(0)
        self.filterCombo.pack(pady=5)

        # Combobox to chose the mandat to seleect (FBI, SDI, MIB, SIB)
        self.mandatSeparator = ttk.Separator(self, orient='horizontal')
        self.mandatSeparator.pack(fill='x', pady=10)
        self.mandatCheckbox = tk.Checkbutton(self, text="Filtrer par mandat", variable=self.mandatEnabled)
        self.mandatCheckbox.pack(pady=5)
        self.mandatLabel = tk.Label(self, text="Selectionez le mandat :")
        self.mandatLabel.pack(pady=5)
        self.mandatCombo = ttk.Combobox(self, values=[
            "FBI",
            "SDI",
            "MIB",
            "SIB", 
        ], state="disabled")
        self.mandatCombo.current(0)
        self.mandatCombo.pack(pady=5)
        self.excludeMandatCheck = tk.Checkbutton(self, text="Inverser la sélection du mandat", state="disabled", variable=self.excludeMandat)
        self.excludeMandatCheck.pack(pady=5)

        # Combobox to chose the pole to select 
        self.poleSeparator = ttk.Separator(self, orient='horizontal')
        self.poleSeparator.pack(fill='x', pady=10)
        self.poleCheckbox = tk.Checkbutton(self, text="Filtrer par pôle", variable=self.poleEnabled)
        self.poleCheckbox.pack(pady=5)
        self.poleLabel = tk.Label(self, text="Selectionez le pôle :")
        self.poleLabel.pack(pady=5)
        self.poleCombo = ttk.Combobox(self, values=[
            "presidence",
            "communication",
            "tresorerie",
            "secretariat",
            "projet",
            "local",
            "MA",
            "MI",
            "prevention",
            "pioux",
            "pls",
            "superviseur",
            "culture",
            "suivi"
        ], state="disabled")
        self.poleCombo.current(0)
        self.poleCombo.pack(pady=5)
        self.excludePoleCheck = tk.Checkbutton(self, text="Inverser la sélection du pôle", state="disabled", variable=self.excludePole)
        self.excludePoleCheck.pack(pady=5)


        # Spinbox to chose the hp condition
        self.hpSeparator = ttk.Separator(self, orient='horizontal')
        self.hpSeparator.pack(fill='x', pady=10)
        self.hpCkeckbox = tk.Checkbutton(self, text="Filtrer par points de vie", variable=self.hpEnabled)
        self.hpCkeckbox.pack(pady=5)
        self.hpLabel = tk.Label(self, text="Points de vie :")
        self.hpLabel.pack(pady=5)
        self.hpOperatorCombo = ttk.Combobox(self, values=[
            "=",
            "<",
            "<=",
            ">",
            ">=",
            "!="
        ], state="disabled")
        self.hpOperatorCombo.current(0)
        self.hpOperatorCombo.pack(pady=5)
        self.hpEntry = tk.Spinbox(self, from_=0, to=1000, state="disabled")
        self.hpEntry.pack(pady=5)


        self.submitSeparator = ttk.Separator(self, orient='horizontal')
        self.submitSeparator.pack(fill='x', pady=10)
        self.submitButton = tk.Button(self, text="Valider", command=self.submit)
        self.submitButton.pack(pady=5)
        self.outputEntry = tk.Entry(self, textvariable=self.selectorOutputVar, state="readonly", width=70)
        self.outputEntry.pack(pady=5)

        # Bind checkbox events to enable/disable related widgets
        self.mandatCheckbox.config(command=self.enable_mandat_filter)
        self.poleCheckbox.config(command=self.enable_pole_filter)
        self.hpCkeckbox.config(command=self.enable_hp_filter)

    def enable_mandat_filter(self):
        if self.mandatEnabled.get():
            self.mandatCombo.config(state="readonly")
            self.excludeMandatCheck.config(state="normal")
        else:
            self.mandatCombo.config(state="disabled")
            self.excludeMandatCheck.config(state="disabled")

    def enable_pole_filter(self):
        if self.poleEnabled.get():
            self.poleCombo.config(state="readonly")
            self.excludePoleCheck.config(state="normal")
        else:
            self.poleCombo.config(state="disabled")
            self.excludePoleCheck.config(state="disabled")
    
    def enable_hp_filter(self):
        if self.hpEnabled.get():
            self.hpOperatorCombo.config(state="readonly")
            self.hpEntry.config(state="normal")
        else:
            self.hpOperatorCombo.config(state="disabled")
            self.hpEntry.config(state="disabled")

    def submit(self):
        filterOptions = [
            "all",
            "self",
            "opponent",
            "hand",
            "opponentHand",
            "allSelf",
            "allOpponent"
        ]
        selectedFilter = filterOptions[self.filterCombo.current()]

        mandatFilter = None
        if self.mandatEnabled.get():
            if self.excludeMandat.get():
                mandatFilter = f"!{self.mandatCombo.get()}"
            else:
                mandatFilter = self.mandatCombo.get()
        
        poleFilter = None
        if self.poleEnabled.get():
            if self.excludePole.get():
                poleFilter = f"!{self.poleCombo.get()}"
            else:
                poleFilter = self.poleCombo.get()
        
        hpCondition = None
        if self.hpEnabled.get():
            hpCondition = self.hpOperatorCombo.get() + self.hpEntry.get()
        
        # Transform selections into output string (json format)
        outputList = [f'"filter": "{selectedFilter}"']
        if mandatFilter:
            outputList.append(f'"mandat": "{mandatFilter}"')
        if poleFilter:
            outputList.append(f'"pole": "{poleFilter}"')
        if hpCondition:
            outputList.append(f'"hp": "{hpCondition}"')
        outputString = "{" + ", ".join(outputList) + "}"
        self.selectorOutputVar.set(outputString)


if __name__ == "__main__":
    app = SelectorUtility()
    app.mainloop()
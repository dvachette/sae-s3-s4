import tkinter as tk
from tkinter import ttk

class EffectCreator(tk.Frame):
    def __init__(self, master):
        super().__init__(master)
        
        self.master = master

        self.mandatEnabled = tk.BooleanVar()
        self.poleEnabled = tk.BooleanVar()
        self.hpEnabled = tk.BooleanVar()
        self.excludeMandat = tk.BooleanVar()
        self.excludePole = tk.BooleanVar()
        self.selectorOutputVar = tk.StringVar()
        
        #   Defining areas

        self.effectArea = tk.Frame(self)
        self.effectTypeArea = tk.Frame(self.effectArea)
        self.effectDurationArea = tk.Frame(self.effectArea)
        self.effectPowerArea = tk.Frame(self.effectArea)


        self.selectorArea = tk.Frame(self)
        self.selectorFiltersArea = tk.Frame(self.selectorArea)
        self.selectorMandatsArea = tk.Frame(self.selectorArea)
        self.selectorPolesArea = tk.Frame(self.selectorArea)
        self.selectorHpArea = tk.Frame(self.selectorArea)


        self.effectTypes = [
            "damage",
            "heal",
            "poison",
            "regen",
            "fatigue",
            "rage",
            "strength",
            "weakness",
            "shield",
            "stun"
        ]
        self.hasDuration = ["poison", "regen", "fatigue", "rage", "strength", "weakness", "stun"]
        self.hasValue = ["damage", "heal", "poison", "regen", "fatigue", "rage", "strength", "weakness", "shield"]

        # Combobox to chose effect type (damage, heal, ...)

        self.effectTypeLabel = tk.Label(self.effectTypeArea, text="Selectionez le type d'effet :")
        self.effectTypeLabel.pack(pady=10)
        self.effectTypeCombo = ttk.Combobox(self.effectTypeArea, values=[
            "Dégat (Inflige des dégats)",
            "Soin (Restaure des points de vie)",
            "Poison (Inflige des dégats sur la durée)",
            "Régenération (Restaure des points de vie sur la durée)",
            "Fatigue (Les attaques coutent plus cher)",
            "Rage (Les attaques coutent moins cher)",
            "Force (Augmente les points d'attaque)",
            "Faiblesse (Diminue les points d'attaque)",
            "Bouclier (Protège contre des coups)",
            "Confusion (Empêche d'attaquer)"
        ], state="readonly", width=40)
        self.effectTypeCombo.current(0)
        self.effectTypeCombo.pack(pady=5)

        # Durée de l'effet

        self.durationLabel = tk.Label(self.effectDurationArea, text="Durée de l'effet en tours :")
        self.durationLabel.pack(pady=10)
        self.durationSpinbox = tk.Spinbox(self.effectDurationArea, from_=1, to=100, width=10, state="disabled")
        self.durationSpinbox.pack(pady=5)

        # Puissance de l'effet
        self.powerLabel = tk.Label(self.effectPowerArea, text="Puissance de l'effet :")
        self.powerLabel.pack(pady=10)
        self.powerSpinbox = tk.Spinbox(self.effectPowerArea, from_=1, to=1000, width=10, state="normal")
        self.powerSpinbox.pack(pady=5)


        
        self.effectTypeArea.pack(side='left', padx=10)
        self.effectSeparator1 = ttk.Separator(self.effectArea, orient='vertical')
        self.effectSeparator1.pack(side='left', fill='y')
        self.effectDurationArea.pack(side='left', padx=10)
        self.effectSeparator2 = ttk.Separator(self.effectArea, orient='vertical')
        self.effectSeparator2.pack(side='left', fill='y')
        self.effectPowerArea.pack(side='left', padx=10)
        self.effectArea.pack(pady=10)


        self.effectSelectorSeparator = ttk.Separator(self, orient='horizontal')
        self.effectSelectorSeparator.pack(fill='x', pady=10)


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
        self.mandatCheckbox = tk.Checkbutton(self.selectorMandatsArea, text="Filtrer par mandat", variable=self.mandatEnabled)
        self.mandatCheckbox.pack(pady=5)
        self.mandatLabel = tk.Label(self.selectorMandatsArea, text="Selectionez le mandat :")
        self.mandatLabel.pack(pady=5)
        self.mandatCombo = ttk.Combobox(self.selectorMandatsArea, values=[
            "FBI",
            "SDI",
            "MIB",
            "SIB", 
        ], state="disabled")
        self.mandatCombo.current(0)
        self.mandatCombo.pack(pady=5)
        self.excludeMandatCheck = tk.Checkbutton(self.selectorMandatsArea, text="Inverser la sélection du mandat", state="disabled", variable=self.excludeMandat)
        self.excludeMandatCheck.pack(pady=5)

        # Combobox to chose the pole to select 
        self.poleCheckbox = tk.Checkbutton(self.selectorPolesArea, text="Filtrer par pôle", variable=self.poleEnabled)
        self.poleCheckbox.pack(pady=5)
        self.poleLabel = tk.Label(self.selectorPolesArea, text="Selectionez le pôle :")
        self.poleLabel.pack(pady=5)
        self.poleCombo = ttk.Combobox(self.selectorPolesArea, values=[
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
        self.excludePoleCheck = tk.Checkbutton(self.selectorPolesArea, text="Inverser la sélection du pôle", state="disabled", variable=self.excludePole)
        self.excludePoleCheck.pack(pady=5)


        # Spinbox to chose the hp condition
        self.hpCkeckbox = tk.Checkbutton(self.selectorHpArea, text="Filtrer par points de vie", variable=self.hpEnabled)
        self.hpCkeckbox.pack(pady=5)
        self.hpLabel = tk.Label(self.selectorHpArea, text="Points de vie :")
        self.hpLabel.pack(pady=5)
        self.hpOperatorCombo = ttk.Combobox(self.selectorHpArea, values=[
            "=",
            "<",
            "<=",
            ">",
            ">=",
            "!="
        ], state="disabled")
        self.hpOperatorCombo.current(0)
        self.hpOperatorCombo.pack(pady=5)
        self.hpEntry = tk.Spinbox(self.selectorHpArea, from_=0, to=1000, state="disabled")
        self.hpEntry.pack(pady=5)
        
        self.selectorMandatsArea.pack(side='left', padx=10)
        self.selectorSeparator1 = ttk.Separator(self.selectorArea, orient='vertical')
        self.selectorSeparator1.pack(side='left', fill='y')
        self.selectorPolesArea.pack(side='left', padx=10)
        self.selectorSeparator2 = ttk.Separator(self.selectorArea, orient='vertical')
        self.selectorSeparator2.pack(side='left', fill='y')
        self.selectorHpArea.pack(side='left', padx=10)
        self.selectorArea.pack(pady=10)
        
        self.removeSelfButton = tk.Button(self, text="Supprimer cet effet", command=lambda: self.master.forget(self))
        self.removeSelfButton.pack(pady=10)
        
        # Bind events to enable/disable related widgets


        self.mandatCheckbox.config(command=self.enable_mandat_filter)
        self.poleCheckbox.config(command=self.enable_pole_filter)
        self.hpCkeckbox.config(command=self.enable_hp_filter)
        self.effectTypeCombo.bind("<<ComboboxSelected>>", self.onEffectTypeChange)

        self.pack()
        self.after(100, self.onEffectTypeChange, None)  # Initial update based on default selection

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

    def onEffectTypeChange(self, event):
        if self.effectTypes[self.effectTypeCombo.current()] in self.hasDuration: 
            self.durationSpinbox.config(state="normal")
        else:
            self.durationSpinbox.config(state="disabled")
        if self.effectTypes[self.effectTypeCombo.current()] in self.hasValue:
            self.powerSpinbox.config(state="normal")
        else:
            self.powerSpinbox.config(state="disabled")
        if isinstance(self.master, ttk.Notebook):
            # Update the name of current tab and not the selected one
            tab_index = self.master.index(self)
            self.master.tab(tab_index, text=f"Effet {tab_index + 1} - {self.effectTypes[self.effectTypeCombo.current()].capitalize()}")

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
        filterList = [f'"filter": "{selectedFilter}"']
        if mandatFilter:
            filterList.append(f'"mandat": "{mandatFilter}"')
        if poleFilter:
            filterList.append(f'"pole": "{poleFilter}"')
        if hpCondition:
            filterList.append(f'"hp": "{hpCondition}"')
        filterString = '"target" : {' + ", ".join(filterList) + "}"
        outputList = [filterString]
        effectType = self.effectTypes[self.effectTypeCombo.current()]
        outputList.append(f'"type": "{effectType}"')
        if effectType in self.hasDuration:
            outputList.append(f'"duration": {self.durationSpinbox.get()}')
        if effectType in self.hasValue:
            outputList.append(f'"value": {self.powerSpinbox.get()}')
        outputString = "{" + ", ".join(outputList) + "}"
        self.selectorOutputVar.set(outputString)
        return outputString
        


if __name__ == "__main__":
    app = tk.Tk()
    app.title("Selector Utility")
    app.geometry("900x600")
    
    # Pouvoir combiner plusieurs effets dans une même carte
    creatorContainer = ttk.Notebook(app)
    creatorContainer.pack(fill='both', expand=True)

    def add_effect_creator_tab():
        effect_creator = EffectCreator(creatorContainer)
        creatorContainer.add(effect_creator, text=f"Effet {len(creatorContainer.tabs()) + 1}")
        creatorContainer.select(len(creatorContainer.tabs()) - 1)
    
    buttonFrame = tk.Frame(app)
    buttonFrame.pack()

    buttonAddTab = tk.Button(buttonFrame, text="Ajouter un effet", command=add_effect_creator_tab)
    buttonAddTab.pack(side='left', padx=10, pady=5)

    buttonReset = tk.Button(buttonFrame, text="Réinitialiser les effets", command=lambda event=None: reset_effects(event))
    buttonReset.pack(side='left', padx=10, pady=5)

    boutonValider = tk.Button(buttonFrame, text="Valider", command=lambda event=None: update_output_entry(event))
    boutonValider.pack(side='left', padx=10, pady=5)

    outputLabel = tk.Label(app, text="Sortie à mettre dans le champ effect (cliquez pour copier dans le presse papier) :")
    outputLabel.pack(pady=5)

    outputEntry = tk.Entry(app, width=120, state="readonly")
    outputEntry.pack(pady=5)

    def update_output_entry(event):
        effectList = []
        for tab_id in creatorContainer.tabs():
            tab = creatorContainer.nametowidget(tab_id)
            effectList.append(tab.submit())
        finalOutput = "[" + ", ".join(effectList) + "]"
        outputEntry.config(state="normal")
        outputEntry.delete(0, tk.END)
        outputEntry.insert(0, finalOutput)
        outputEntry.config(state="readonly")

    def on_output_entry_click(event):
        app.clipboard_clear()
        app.clipboard_append(outputEntry.get())
    
    def reset_effects(event):
        for tab_id in creatorContainer.tabs():
            tab = creatorContainer.nametowidget(tab_id)
            creatorContainer.forget(tab)
        update_output_entry(None)

    outputEntry.bind("<Button-1>", on_output_entry_click)

    app.mainloop()
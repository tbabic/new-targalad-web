var characterLevelComponent = httpVue.component("level-component", {
	templateUrl:"views/levelPickerView.html",
	data: function() {
		return {
			level: myCharacter.masterLevel != null ? myCharacter.masterLevel : myCharacter.level,
			character : myCharacter,
		}
	},
	methods: {
		setLevel: function() {
			if (myCharacter.masterLevel != null) {
				myCharacter.masterLevel = this.level;
				window.localStorage.setItem("character-level", myCharacter.masterLevel);
			} else {
				myCharacter.level = this.level;
				window.localStorage.setItem("character-level", myCharacter.level);
			}
			
		}
	}
});
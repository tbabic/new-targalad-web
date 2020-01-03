var characterLevelComponent = httpVue.component("level-component", {
	templateUrl:"views/levelPickerView.html",
	data: function() {
		return {
			level: myCharacter.level
		}
	},
	methods: {
		setLevel: function() {
			myCharacter.level = this.level;
			window.localStorage.setItem("character-level", myCharacter.level);
		}
	}
});
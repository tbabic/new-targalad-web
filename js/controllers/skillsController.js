console.log("skillsController");

var skillsComponent = httpVue.component("spellbook-component", {
	templateUrl:"views/skillsView.html",
	data: function() {
		return {
			character: myCharacter,
			skills: myCharacter.skillSet.getSkillsList()
		}
	},
	methods : {
		addRank(skill) {
			skill.addRank(1);
		}, 
		removeRank(skill) {
			skill.addRank(-1);
		}
	}
});
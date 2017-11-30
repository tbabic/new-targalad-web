console.log("skillsController");

$(".skill-add-btn").on("click", function(event) {
	var skillName = $(event.target).data("skillName");
	var skill = myCharacter.skillSet.getSkill(skillName);
	skill.addRank(1);
	var skillRanks = $(event.target).closest(".skill-row").find(".skill-rank");
	$(skillRanks).text(skill.ranks);
});

$(".skill-remove-btn").on("click", function(event) {
	var skillName = $(event.target).data("skillName");
	var skill = myCharacter.skillSet.getSkill(skillName);
	skill.addRank(-1);
	var skillRanks = $(event.target).closest(".skill-row").find(".skill-rank");
	$(skillRanks).text(skill.ranks);
});
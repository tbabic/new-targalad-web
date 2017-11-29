function serializationObj(character) {
	var characterSer = {
			level : character.level,
			attributes : {
				strength : character.attributes.strength.value,
				dexterity : character.attributes.dexterity.value,
				constitution : character.attributes.constitution.value,
				intelligence : character.attributes.intelligence.value,
				wisdom : character.attributes.wisdom.value,
				charisma : character.attributes.charisma.value,
			},
			characterClass : {
				arcanas : []
			}
	};
}
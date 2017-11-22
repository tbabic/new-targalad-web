function StatusEffect(source, category, bonusType, bonusValue) {
	this.source = source;
	this.category = category;
	this.bonusType = bonusType;
	this.bonusValue = bonusValue;
	this.isActive = false;
	
	this.activate = function() {
		this.isActive = true;
		
	};
	this.deactivate = function() {
		this.isActive = false;
	};
	
}
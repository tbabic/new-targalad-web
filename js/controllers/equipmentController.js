var equipmentComponent = httpVue.component("equipment-component", {
	templateUrl:"views/equipmentView.html",
	data: function() {
		return {
			character : myCharacter,
			equipment: myCharacter.equipment,
			slots : slotList,
			
			itemSelector : {
				slot : {},
				propertiesPickerList : [{
					name:"NONE",
					option: ""
				}]
			},
			armorSelector : {
				type : "",
				typeList : [],
				category : "",
				categoryList : ["light", "medium", "heavy"],
				armorBonus : "",
				maxDexBonus : "",
				armorCheckPenalty : ""
			},
			weaponSelector : {
				type : "",
				typeList : []
			}
		}
	},
	methods : {
		
		equipItem() {
			let slot = this.itemSelector.slot;
			let item = undefined;
			
			
			if (slot.name == "weapon") {
				item = this.mapWeapon();
			} else if (slot.name == "armor") {
				item = this.mapArmor();
			} else {
				item = this.mapItem();
			}
			
			if (slot.name == "leftRing") {
				this.character.equipment.addLeftRing(item);
			} else if (slot.name == "rightRing") {
				this.character.equipment.addRightRing(item);
			} else {
				this.character.addItem(item);
			}
			this.loadEquippedItems();
			
			persistEquipmentToStorage(this.character);
		},
		
		mapWeapon() {
			
			let name = "";
			let enhancement = 0;
			let properties = [];
			let special = undefined;
			let masterwork = false;
			
			this.itemSelector.propertiesPickerList.forEach(prop => {
				if(prop.name == "NONE") {
					return;
				}
				if (prop.name == "MASTERWORK") {
					if (enhancement == 0) {
						masterwork = true;
					}
					
					return;
				}
				if (prop.name == "ENHANCEMENT") {
					masterwork = false;
					enhancement = prop.option;
					return;
				}
				
				if (SpecialProperties[prop.name] != undefined) {
					special = SpecialProperties[prop.name];
				}					
			});
			
			if (masterwork && enhancement == 0) {
				properties.push(new Bonus(BonusCategory.TO_HIT, BonusType.ENHANCEMENT, 1, "MASTERWORK WEAPON"));
				name = prettifyString("Masterwork " + this.weaponSelector.type)
			} else if (enhancement > 0) {
				name = prettifyString(this.weaponSelector.type) + " +" + enhancement;
			} else {
				name = prettifyString(this.weaponSelector.type);
			}
			
			if (special != undefined) {
				name = prettifyString(special.name) + " " + name;
			}
			
			item = new Weapon(name, this.weaponSelector.type, enhancement, 0, properties, special);
			return item;
		},
		
		mapArmor() {
			let name = prettifyString(this.armorSelector.type);
			let enhancement = 0;
			let properties = [];
			
			this.itemSelector.propertiesPickerList.forEach(prop => {
				if(prop.name == "NONE") {
					return;
				}
				if (prop.name == "ENHANCEMENT" && prop.option != "") {
					enhancement = prop.option;
					return;
				}				
			});
				
			if (enhancement > 0) {
				name += " +" + enhancement;
			}
			item = new Armor(name, this.armorSelector.type, this.armorSelector.category, this.armorSelector.armorBonus, this.armorSelector.maxDexBonus, 
						enhancement, this.armorSelector.armorCheckPenalty, 0, 0, properties);
			return item;
		},
		
		mapItem() {
			let slot = this.itemSelector.slot;
			let name = prettifyString(slot.type);
			if (slot.type == "neck") {
				name = "Amulet";
			}
			if (slot.type == "shoulders") {
				name = "Cloak"
			}
			if (slot.type == "wrists") {
				name = "Bracers"
			}
			if (slot.type == "hands") {
				name = "Gloves"
			}
			if (slot.type == "feet") {
				name = "Boots"
			}
			
			let isFirst = true;
			this.itemSelector.propertiesPickerList.forEach(p => {
				if (p.name != "NONE") {
					name += isFirst ? " of " : ", "
					
					name+=prettifyString(p.name);
					isFirst = false;
					if (p.option != "" && p.option != undefined) {
						name += " +"+p.option;
					}
				}
			});
			

			let properties = [];
			this.itemSelector.propertiesPickerList.forEach(p => {
				if (p.name == "NONE") {
					return;
				}
				if (["STRENGTH","DEXTERITY","CONSTITUTION","INTELLIGENCE","WISDOM", "CHARISMA"].includes(p.name)) {
					properties.push(new Bonus(p.name, BonusType.ENHANCEMENT, +p.option, name));	
				}
				
				if (p.name == "RESISTANCE") {
					properties.push(new Bonus(BonusCategory.SAVES, BonusType.RESISTANCE, +p.option, name));
				}
				if (p.name == "DEFLECTION") {
					properties.push(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.DEFLECTION, +p.option, name));
				}
				if (p.name == "NATURAL_ARMOR") {
					properties.push(new Bonus(BonusCategory.ARMOR_CLASS, BonusType.NATURAL_ARMOR, +p.option, name));
				}
			});
			
			item = new Item(name, slot.name, properties, 0, undefined);
			
			return item;
		},
		
		removeItem(slot) {
			slot.item.unequip();
			this.character.equipment[slot.name] = undefined;
			this.loadEquippedItems();
		},
		
		changeItem(slot) {
			this.itemSelector.slot = slot;
			this.itemSelector.propertiesPickerList = [];
			
			if (slot.type == "weapon") {
				this.weaponSelector.type = slot.item.type;
			}
			
			if (slot.type == "armor") {
				this.armorSelector.type = slot.item.type;
				this.armorSelector.category = slot.item.category.toLowerCase();
				this.armorSelector.armorBonus = slot.item.armorBonus.value - slot.item.enhancement;
				this.armorSelector.maxDexBonus = slot.item.maxDexBonus;
				this.armorSelector.armorCheckPenalty = slot.item.armorCheckPenalty;
			}
			
			if (slot.type == "weapon" || slot.type == "armor") {
				if (slot.item.enhancement > 0) {
					this.itemSelector.propertiesPickerList.push({
						name:"ENHANCEMENT",
						option: slot.item.enhancement
					});
				}
				
				if(slot.item.special != undefined) {
					let specialName = slot.item.special.name.toUpperCase();
					if (SpecialProperties[specialName] != undefined) {
						this.itemSelector.propertiesPickerList.push({
							name:specialName,
							option: ""
						});
					}
				}
			}
			
			let properties = this.selectorAllProperties;
			
			if (slot.item.properties != undefined) {
				slot.item.properties.list().forEach(prop => {
					let filtered = properties.filter( p => {
						return prop.bonus.categories.includes(p.name) || prop.bonus.type == p.name; 
					});
					
					if (slot.item instanceof Weapon && prop.bonus.name == "MASTERWORK WEAPON") {
						filtered = properties.filter(p => p.name == "MASTERWORK");
					}
					
					
					if (filtered != undefined && filtered.length > 0) {
						let option = "";
						if (filtered[0].options != undefined) {
							option = prop.bonus.value;
						}
						
										
						this.itemSelector.propertiesPickerList.push({
							name:filtered[0].name,
							option: option
						});
					}
				});
			}
			
			
			this.itemSelector.propertiesPickerList.push({
				name:"NONE",
				option: ""
			});

		},
		
		
		
		loadEquippedItems() {
			this.slots.forEach(slot => {
				if (this.equipment[slot.name] != undefined) {
					slot.item = this.equipment[slot.name];
				} else {
					slot.item = this.item = {
						name : "empty"
					}
				}
			});
			return;
		},
		
		selectedPropertyOptions(selectedProperty) {
			let property= this.selectorAllProperties.filter(i => i.name == selectedProperty)[0];
			return property.options;
		},
		
		hasOptions(selectedProperty) {
			if (this.selectedPropertyOptions(selectedProperty) == undefined) {
				return false;
			}
			return true;
		},
		
		refreshSelector() {
			let pickers = this.itemSelector.propertiesPickerList;
			for(i=(pickers.length -1); i>= 0; i--) {
				if (i == pickers.length -1 && pickers[i].name == "NONE") {
					continue;
				} else if(i == pickers.length-1 && pickers[i].name != "NONE") {
					pickers.push({
						name:"NONE",
						option: ""
					});
					continue;
				} else if (pickers[i].name != "NONE") {
					continue;
				}
				pickers.splice(i, 1);
			}
			console.log("refresh selector");
		},
	},
	computed : {
		
		selectorAllProperties : function() {
			let slot = this.itemSelector.slot;
			let props = itemProperties[slot.type];
			if (props == undefined) {
				props = itemProperties.other;
			}
			return props;
		},
		
		selectorActiveProperties : function() {
			return this.selectorAllProperties;
		}
	},
	mounted : function() {
		
		let weaponTypes = this.weaponSelector.typeList;
		for (let type in WeaponType.properties) {
			let visibleName = type.replace("_", " ").toLowerCase();
			visibleName = visibleName.charAt(0).toUpperCase() + visibleName.slice(1);
			weaponTypes.push({
				type : type,
				name : visibleName
			});
		}
		
		let armorTypes = this.armorSelector.typeList;
		for (let type in ArmorType.properties) {
			let visibleName = type.replace("_", " ").toLowerCase();
			visibleName = visibleName.charAt(0).toUpperCase() + visibleName.slice(1);
			armorTypes.push({
				type : type,
				name : visibleName
			});
		}
		
		this.loadEquippedItems();
	}
});

var Slot = function(name,visibleName, type, item ) {
	this.name = name;
	
	if (visibleName == undefined) {
		this.visibleName = name.charAt(0).toUpperCase() + name.slice(1);
	} else {
		this.visibleName = visibleName;
	}
	
	if (type == undefined) {
		this.type = name;
	} else {
		this.type = type;
	}
	
	if (item == undefined) {
		this.item = {
			name : "empty"
		}
		return;
	} else {
		this.item = item;
	}
	
	let properties = this.selectorAllProperties;
	
	if (slot.item.properties != undefined) {
		slot.item.properties.list().forEach(prop => {
			let filtered = properties.filter( p => {
				return prop.bonus.categories.includes(p.name) || prop.bonus.type == p.name; 
			});
			if (filtered != undefined && filtered.length > 0) {
				let option = "";
				if (filtered[0].options != undefined) {
					option = prop.bonus.value;
				}
				this.itemSelector.propertiesPickerList.push({
					name:filtered[0].name,
					option: option
				});
			}
		});
	}
	
	
	
	
}

var slotList =  [new Slot("armor"),
			new Slot("weapon"), 
			//new Slot("shield"),
			new Slot("head"),
			new Slot("headband"),
			new Slot("eyes"),
			new Slot("shoulders"),
			new Slot("neck"),
			new Slot("chest"),
			new Slot("body"),
			new Slot("belt"),
			new Slot("wrists"),
			new Slot("hands"),
			new Slot("feet"),
			new Slot("leftRing", "Left Ring", "ring"),
			new Slot("rightRing", "Right Ring", "ring")];

var propertyCreator = function(propertyName, start, end, step) {
	if (step == undefined) {
		step =1;
	}
	if (start == undefined) {
		return [{
			name : propertyName
		}];
	}
	
	
	let options = [];
	for (let i = start; i <= end; i+=step) {
		let name = (propertyName + " +" + i);
		options.push({
			name : "+"+i,
			value: i
		})
	}
	return [{
			name : propertyName,
			options : options
		}];
};

var itemProperties = {
	weapon : propertyCreator("NONE").concat(propertyCreator("MASTERWORK")).concat(propertyCreator("FURIOUS")).concat(propertyCreator("ENHANCEMENT", 1, 5)),
	armor : propertyCreator("NONE").concat(propertyCreator("ENHANCEMENT", 1, 5)),
	shield : propertyCreator("NONE").concat(propertyCreator("ENHANCEMENT", 1, 5)),
	other : propertyCreator("NONE").concat(propertyCreator("DEFLECTION", 1, 5)).concat(propertyCreator("RESISTANCE", 1, 5)).concat(propertyCreator("NATURAL_ARMOR", 1,5))
			.concat(propertyCreator("STRENGTH", 2, 6, 2)).concat(propertyCreator("DEXTERITY", 2, 6, 2)).concat(propertyCreator("CONSTITUTION", 2, 6, 2))
			.concat(propertyCreator("WISDOM", 2, 6, 2)).concat(propertyCreator("INTELLIGENCE", 2, 6, 2)).concat(propertyCreator("CHARISMA", 2, 6, 2))
};

var prettifyString = function(string) {
	let visibleName = string.replace("_", " ").toLowerCase();
	visibleName = visibleName.charAt(0).toUpperCase() + visibleName.slice(1);
	return visibleName;
}






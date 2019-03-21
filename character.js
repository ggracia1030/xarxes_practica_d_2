function Character (_name, _power, _type) {
    this.name = new String(_name);
    this.power = _power;
    this.type = new String(_type);
}

module.exports = Character;
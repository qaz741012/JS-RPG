class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }

    var _this = this;
    var i = 1;
    _this.id = setInterval(function(){
      if (i <= 8) {
        if (i >1) {
          _this.element.getElementsByClassName("attack-effect-image")[i-2].style.display = "none";
        }
        _this.element.getElementsByClassName("attack-effect-image")[i-1].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("attack-effect-image")[i-2].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp/this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄" + this.name + "!");
  }

  attack(character) {
    var damage = Math.random()*(this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }

  heal() {
    if (this.hp <= (this.maxHp - 30)) {
      this.hp += 30;
      var heal_number = 30;
    } else {
      var heal_number = (this.maxHp - this.hp);
      this.hp = this.maxHp;
    }
    this.updateHtml(this.hpElement, this.hurtElement);

    var _this = this;
    var i = 1;
    _this.id = setInterval(function() {
      if (i <= 8) {
        if (i > 1) {
          _this.element.getElementsByClassName("heal-effect-image")[i-2].style.display = "none";
        }
        _this.element.getElementsByClassName("heal-effect-image")[i-1].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = heal_number;
      }
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("heal-effect-image")[i-2].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("怪物" + this.name + "出現了!");
  }

  attack(character) {
    var damage = Math.random()*(this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

// 創建角色
var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 30);

// 戰鬥事件驅動
function addSkillEvent() {
  var skill = document.getElementById("skill");
  var heal = document.getElementById("heal");
  skill.onclick = function() {
    heroAttack();
  }
  heal.onclick = function() {
    heroHeal();
  }
}
addSkillEvent();

// 回合結束機制
var rounds = 10;
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    finish();
  }
}

// 英雄攻擊
function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function(){
    hero.element.classList.add("attacking");
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function(){
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          setTimeout(function(){
            document.getElementsByClassName("skill-block")[0].style.display = "block";
          }, 500);
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}

// 結束遊戲
function finish() {
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

// 英雄治療
function heroHeal() {
  hero.heal();
  setTimeout(function(){
    monster.element.classList.add("attacking");
    setTimeout(function(){
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      if (hero.alive == false) {
        finish();
      } else {
        setTimeout(function(){
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }, 500);
      }
    }, 500);
  }, 100);
}

// 按鍵驅動
document.onkeydown = function(event) {
  var key = String.fromCharCode(event.keyCode);
  if (key == "A") {
    heroAttack();
  } else if (key == "D") {
    heroHeal();
  }
}

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 463:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

__webpack_require__(489);

__webpack_require__(2419);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Client = __webpack_require__(927);

var handleMessage = __webpack_require__(6663);

var Bot = /*#__PURE__*/function (_Client) {
  "use strict";

  _inherits(Bot, _Client);

  var _super = _createSuper(Bot);

  function Bot(clientId, websocket) {
    var _this;

    _classCallCheck(this, Bot);

    _this = _super.call(this, clientId, websocket);
    _this.isBot = true;
    var _message = _this.message; //So we don't lose access to the websocket based sending.

    var lastSent;
    var lastWasError;

    _this.message = function message(type, message, status) {
      if (lastWasError) {
        lastWasError = false;
        return;
      } //First bot error disables bot temporarily.


      if (this.suppressed) {
        return;
      } //Isn't really neccessary, as the bot should never receive roomActionState while suppressed, however a good measure.


      if (this.websocket) {
        //Bot being manually controlled.
        _message(type, message, status);
      }

      handleMessage.call(this, {
        type: type,
        message: message,
        status: status
      });
    }.bind(_assertThisInitialized(_this));

    return _this;
  }

  return Bot;
}(Client);

module.exports = Bot;

/***/ }),

/***/ 4497:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(7327);

__webpack_require__(7042);

__webpack_require__(4553);

__webpack_require__(561);

__webpack_require__(4747);

__webpack_require__(2222);

__webpack_require__(9826);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

var Match = __webpack_require__(9458);

var Pretty = __webpack_require__(4810);

var TileContainer = __webpack_require__(502);

var utilities = __webpack_require__(2976);

var seed = Math.random();

var SeedRandom = __webpack_require__(7905);

function evaluateNextMove() {
  var room = this.getRoom();

  if (room.inGame === false) {
    return;
  } //Nothing for us to do not in a game.


  var gameData = room.gameData;
  var currentHand = gameData.playerHands[this.clientId];

  if (gameData.currentTurn.turnChoices[this.clientId]) {
    return;
  }

  ; //We are ready for this turn.
  //Call room.onPlace properly.

  var placeTiles = function placeTiles() {
    var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var goMahjong = arguments.length > 1 ? arguments[1] : undefined;

    if (!(tiles instanceof Array)) {
      tiles = [tiles];
    }

    room.onPlace({
      mahjong: goMahjong || undefined,
      swapJoker: true,
      //Special parameter for bots - auto-swaps when possible.
      type: "roomActionPlaceTiles",
      message: tiles = tiles.map(function (tile) {
        return tile.toJSON();
      })
    }, this.clientId);
  }.bind(this); //Bot difficulty settings.
  //While the max settings really aren't broken - bots can still get locked into impossible hands (dead tiles),
  //and aren't aware of what others are doing, that is counterbalanced by their superhuman analysis abilities.
  //Since in single player modes, people want to win quite a bit of the time, we're going to balance it out a bit more.


  var botDifficultyConfig = {
    botDifficulty: room.state.settings.americanBotDifficulty
  };
  var expo = 50;
  botDifficultyConfig.cardPercentage = 100 / expo * Math.pow(expo, botDifficultyConfig.botDifficulty / 100);
  botDifficultyConfig.maxAnalysisRounds = Infinity;

  if (botDifficultyConfig.botDifficulty < 100) {
    botDifficultyConfig.maxAnalysisRounds = Math.max(1, 100 * Math.pow(0.7, 100 - botDifficultyConfig.botDifficulty));
  }

  botDifficultyConfig.averageAnalyzedCharlestonTiles = 3 - 1.5 * (100 - botDifficultyConfig.botDifficulty) / 100; //Bots will be forced to randomly charleston some tiles.
  //We'll only filter the card once, and store it for later.
  //This is extremely cheap normally, but can take a few milliseconds with tons of combos (Marvelous hands)
  //Easy small speedup.

  var cardToUse = this._cardToUse;
  var seed = this.clientId + room.state.seed; //We need the same random tiles every time, even reloading from state.

  if (!cardToUse || cardToUse.seed !== seed) {
    cardToUse = gameData.card.combos;
    var maxHands = 1000; //Marvelous has a huge number of hands. We'll clamp the bots down.

    botDifficultyConfig.cardPercentage = botDifficultyConfig.cardPercentage / Math.max(1, cardToUse.length / maxHands); //Reduce bot card proportion.

    if (botDifficultyConfig.cardPercentage < 100) {
      var filterSeedRandom = SeedRandom(seed);
      cardToUse = cardToUse.filter(function (item, index) {
        if (!index) {
          return true;
        } //Make sure there is always at least one combo - zero combos would crash.


        return filterSeedRandom() * 100 < botDifficultyConfig.cardPercentage;
      });
    }

    cardToUse.seed = seed;
    this._cardToUse = cardToUse;
  }

  var allowedAnalysisTiles = Math.floor(botDifficultyConfig.averageAnalyzedCharlestonTiles + Math.random());
  console.time("Analyze");
  var analysis = utilities.getTileDifferential(cardToUse, currentHand.contents);
  console.timeEnd("Analyze"); //Find tiles not used in any of the top combos if possible - that way we don't sabotage our next best options.

  function getTopTiles(analysis, maxAmount) {
    var noJokers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    maxAmount = Math.max(1, maxAmount);
    var toThrow = analysis[0].notUsed.slice(0);

    if (noJokers) {
      toThrow = toThrow.filter(function (item) {
        return item.type !== "joker";
      });
    } //We start at item 0 to give the joker elimination code a chance to run.


    analysisLoop: for (var i = 0; i < analysis.length; i++) {
      var analysisItem = analysis[i];

      var _loop = function _loop(_i2) {
        if (toThrow.length <= maxAmount) {
          _i = _i2;
          return "break|analysisLoop";
        }

        if (_i2 > botDifficultyConfig.maxAnalysisRounds) {
          _i = _i2;
          return "break|analysisLoop";
        }

        var toThrowItem = toThrow[_i2]; //If this item does not exist in notUsed, it is needed for one of the top hands.
        //Therefore, we shouldn't throw it.

        var index = void 0;

        if (toThrowItem.type === "joker") {
          //We will throw jokers only when there are no other options.
          index = -1;
        } else {
          index = analysisItem.notUsed.findIndex(function (item) {
            _i = _i2;
            return item.matches(toThrowItem);
          });
        }

        if (index === -1) {
          //Remove the item from toThrow
          toThrow.splice(_i2, 1);
          _i2--;
        }

        _i = _i2;
      };

      for (var _i = 0; _i < toThrow.length; _i++) {
        var _ret = _loop(_i);

        if (_ret === "break|analysisLoop") break analysisLoop;
      }
    } //If there is only a small number of possible hands given exposures, we might have more than maxAmount tiles.
    //In that case, we'll eliminate some. This is currently done at random.


    while (maxAmount < toThrow.length) {
      toThrow.splice(Math.floor(Math.random() * toThrow.length), 1);
    }

    return toThrow;
  }

  if (gameData.charleston) {
    var round = gameData.charleston.directions[0][0];

    if (round.blind) {
      //Blind pass. Pass as many as notUsed, 3 max.
      //TODO: We want to analyze at most allowedAnalysisTiles, but want to pass 3 to a person if they send us 3.
      //So analyze allowedAnalysisTiles, rest random is probably best.
      placeTiles(getTopTiles(analysis, allowedAnalysisTiles, true));
    } else if (round.allAgree && getTopTiles(analysis, 3, true).length < 3) {
      //TODO: Consider if we want to require more than 3 for allAgree rounds.
      //We can't produce 3 tiles without throwing ones we want. Kill the round.
      placeTiles([]);
    } else {
      //We must produce exactly 3 tiles. We must not pick jokers.
      var passing = []; //We will pass every tile in notUsed. Remove them from the hand when picked.

      getTopTiles(analysis, allowedAnalysisTiles, true).forEach(function (item) {
        passing.push(item);
        currentHand.remove(item);
      }); //Pick randomly from remaining tiles until we have 3 tiles to pass.

      while (passing.length < 3) {
        var removed = currentHand.contents[Math.floor(Math.random() * currentHand.contents.length)]; //Random pick.

        if (removed.type === "joker") {
          continue;
        } //This should never get stuck, as there are only 8 jokers, and we are in charleston.


        passing.push(removed);
        currentHand.remove(removed);
      } //Restore the removed tiles and pass them.


      passing.forEach(function (item) {
        currentHand.add(item);
      });
      placeTiles(passing);
    }
  } else if (gameData.currentTurn.userTurn === this.clientId) {
    var _analysis$, _analysis$$notUsed, _analysis$2;

    //We need to choose a discard tile.
    //In American Mahjong, charleston starts automatically, so there is nothing needed to initiate charleston.
    if (((_analysis$ = analysis[0]) === null || _analysis$ === void 0 ? void 0 : (_analysis$$notUsed = _analysis$.notUsed) === null || _analysis$$notUsed === void 0 ? void 0 : _analysis$$notUsed.length) > 0) {
      var tile = getTopTiles(analysis, 1);
      placeTiles(tile);
    } else if (((_analysis$2 = analysis[0]) === null || _analysis$2 === void 0 ? void 0 : _analysis$2.diff) === 0) {
      placeTiles([], true); //Go Mahjong
    } else {
      //Our hand should only be dead if we start checking exposed tiles in the future.
      //Otherwise, we should never make a move that would make us dead by our detection.
      console.error("Bot hand appears to be dead. Initiating emergency pick. ");
      throw "Hand is Dead";

      if (!currentHand.contents.some(function (tile) {
        if (tile instanceof Tile) {
          placeTiles(tile);
          return true;
        }
      })) {
        throw "Bot was unable to choose a discard tile. ";
      }
    }
  } else if (gameData.currentTurn.thrown) {
    if (gameData.currentTurn.thrown.type === "joker") {
      return placeTiles([]);
    } //Can't pick up a joker.
    //We need to evaluate if we pick up the thrown tile.
    //Take another analysis with the additional tile.


    var withTileAnalysis = utilities.getTileDifferential(cardToUse, currentHand.contents.concat(gameData.currentTurn.thrown)); //We should ALWAYS have one handOption available, given how we do not analyze discards,
    //and an additional tile not in a match shouldn't remove any possibilities,

    if (!withTileAnalysis[0]) {
      throw "Bot Hand is Dead";
    } else if (withTileAnalysis[0].handOption.concealed && withTileAnalysis[0].diff !== 0) {//The top hand including this tile would be concealed, and it would not be for Mahjong.
    } else if (withTileAnalysis.some(function (withTileAnalysisItem) {
      if (withTileAnalysisItem.diff < analysis[0].diff) {
        //Claiming this tile would put us closer to Mahjong.
        //TODO: There are still some issues with hands like 2021 #3, where we need a kong,
        //but that kong must include at least one joker, or we make our hand dead. (As 5 total are needed, 1 single, 1 kong)
        //Now we need to confirm we actually can claim it.
        //Jokers will complicate this.
        //First, determine what match this tile would be going into, to tell if jokers can be used.
        var match = withTileAnalysisItem.handOption.tiles.find(function (arr) {
          if (arr[0].matches(gameData.currentTurn.thrown)) {
            return true;
          }
        });
        console.warn("Want Tile");

        if (match) {
          console.log(match);
          var tilesToPlace = []; //If this tile is beneficial, we shouldn't have enough of it, so don't need to check against match length here.

          currentHand.contents.forEach(function (item) {
            if (match[0].matches(item)) {
              tilesToPlace.push(item);
            }
          });

          if (match.length > 2) {
            currentHand.contents.forEach(function (item) {
              if (tilesToPlace.length !== match.length - 1) {
                if (item.type === "joker") {
                  tilesToPlace.push(item);
                }
              }
            });

            if (tilesToPlace.length === match.length - 1) {
              placeTiles(tilesToPlace.concat(gameData.currentTurn.thrown));
              return true;
            } else {
              console.warn("Continuing");
            }
          } else if (withTileAnalysisItem.diff === 0) {
            //Can only pick up for Mahjong.
            if (tilesToPlace.length === match.length - 1) {
              placeTiles(tilesToPlace.concat(gameData.currentTurn.thrown), true);
              return true;
            } else {
              console.warn("Continuing Needs Mahjong");
            } //Can't really think of when this would trigger?

          } else {
            console.warn("Mahj only. Continuing. ");
          }
        } else {
          console.warn(gameData.currentTurn.thrown, currentHand.contents, analysis[0], withTileAnalysisItem);
          console.warn("Something odd happened, probably in sorting, causing a match not including the thrown tile to be provided. ");
        }
      }
    })) {
      console.warn("Returned");
      return;
    }

    placeTiles([]);
  }
}

module.exports = evaluateNextMove;

/***/ }),

/***/ 5681:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

__webpack_require__(1249);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(7327);

__webpack_require__(9601);

__webpack_require__(4747);

__webpack_require__(6699);

__webpack_require__(2707);

__webpack_require__(7941);

__webpack_require__(2222);

__webpack_require__(3290);

__webpack_require__(7042);

__webpack_require__(5827);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(1038);

__webpack_require__(8309);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

var Match = __webpack_require__(9458);

var Pretty = __webpack_require__(4810);

function evaluateNextMove() {
  var room = this.getRoom();

  if (room.inGame === false) {
    return;
  } //Nothing for us to do not in a game.


  var gameData = room.gameData;
  var currentHand = gameData.playerHands[this.clientId];

  if (gameData.currentTurn.turnChoices[this.clientId]) {
    return;
  }

  ; //We are ready for this turn.
  //Call room.onPlace properly.

  var placeTiles = function placeTiles() {
    var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var goMahjong = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentHand.isMahjong(room.state.settings.maximumSequences);

    if (!(tiles instanceof Array)) {
      tiles = [tiles];
    }

    room.onPlace({
      mahjong: goMahjong || undefined,
      type: "roomActionPlaceTiles",
      message: tiles = tiles.map(function (tile) {
        return tile.toJSON();
      })
    }, this.clientId);
  }.bind(this);

  if (currentHand.isMahjong(room.state.settings.maximumSequences)) {
    return placeTiles();
  } //Go mahjong.


  function computeHandBreakdown(tiles, userWind) {
    var _this = this,
        _breakdown$strategy$t,
        _breakdown$strategy$t2;

    var customConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    tiles = tiles.filter(function (item) {
      return !(item instanceof Pretty);
    }); //TODO: Need support for clearing to terminals (1s and 9s), even though it is somewhat rare.
    //TODO: Also need to weigh 1s and 9s more highly than other tiles when choosing suits and what to throw.
    //TODO: Also need to weigh dragons and own wind above other winds.
    //TODO: Need to throw dead or nearly dead tiles sooner.

    var config = {
      looseTileCost: 5,
      //We should cut this dramatically if we have yet to charleston. Probably pass around 2.
      possibleDoubleRatio: 0.4,
      //Should be no more than 1. Reduction in double value for first pair that might result in doubles.
      chooseSecondarySuit: false,
      //Intended for charleston, don't suggest weakest suit, suggest next weakest, if there are all 3.
      charleston: false //Used to determine in hand kong placements.

    };
    Object.assign(config, customConfig);
    var breakdown = {};
    tiles.forEach(function (tile) {
      var type = tile.type;

      if (["wind", "dragon"].includes(tile.type)) {
        type = "honor";
      }

      breakdown[type] = breakdown[type] || [];
      breakdown[type].push(tile);
    }); //For .sort

    function getValue(item) {
      if (item instanceof Tile) {
        return Math.random();
      } //We want the tiles to be randomly ordered. This is far from perfect, but should help move them slightly.


      return item.amount;
    }

    function prepForSelection(arr) {
      arr.sort(function (a, b) {
        return getValue(a) - getValue(b);
      });
      arr = arr.filter(function (a) {
        if (!a.isGenerated && a instanceof Match) {
          return false;
        } else {
          return true;
        }
      });
      return arr;
    }

    var _loop = function _loop(type) {
      var tiles = breakdown[type];
      var generationHand = new Hand();
      generationHand.contents = tiles.slice(0);

      var _loop2 = function _loop2(_i) {
        var tile = generationHand.contents[_i];

        if (!(tile instanceof Tile)) {
          i = _i;
          return "continue";
        }

        ;
        [4, 3, 2].forEach(function (amount) {
          if (generationHand.removeMatchingTilesFromHand(tile, amount)) {
            _i--; //Counteract position shifting.

            var item = new Match({
              amount: amount,
              type: tile.type,
              value: tile.value,
              exposed: false
            });
            item.isGenerated = true;
            generationHand.contents.push(item);
          }
        }.bind(_this));
        i = _i;
      };

      for (var i = 0; i < generationHand.contents.length; i++) {
        var _ret = _loop2(i);

        if (_ret === "continue") continue;
      } //If we start off with ANY honor doubles, we will include honors.


      var obj = generationHand.contents.reduce(function (totals, currentItem) {
        //Weight: The cost of clearing away.
        //Value: The value this suit provides.
        totals.weight += config.looseTileCost * (currentItem.amount || 1); //valueMult: Multiplier for value (only applicable to honors) due to doubles.

        if (currentItem.isDouble(userWind)) {
          totals.valueMult += 1;
        } else if (currentItem.isDouble(userWind, true)) {
          if (Math.round(totals.valueMult) === totals.valueMult) {
            totals.valueMult += config.possibleDoubleRatio; //TODO: We should have dragons be lower than your wind
          } else {
            totals.valueMult += 1;
          } //We only go out with one pair, therefore, if we keep honors, we will at most have one potential, non guaranteed, double.

        }

        if (currentItem.amount === 2) {
          totals.value += 10;
        } else if (currentItem.amount === 3) {
          totals.value += 25;
        } else if (currentItem.amount === 4) {
          totals.value += 40;
        }

        return totals;
      }, {
        weight: 0,
        value: 0,
        valueMult: 0
      });
      obj.value *= Math.pow(2, obj.valueMult);
      delete obj.valueMult;
      Object.assign(obj, {
        tiles: tiles,
        contents: generationHand.contents
      });
      obj.contents = prepForSelection(obj.contents);
      breakdown[type] = obj;
    };

    for (var type in breakdown) {
      _loop(type);
    } //Decide recommended strategy.


    var standardTypes = Object.assign({}, breakdown);
    delete standardTypes.honor;
    var strategy = {
      honors: false
    };
    var suits = Object.keys(standardTypes);

    if (suits.length > 1) {
      strategy.honors = true;
    } //No reason to eliminate honors at the moment.


    if (suits.length === 1) {
      strategy.suit = suits[0];
    } else {
      var results = [];

      for (var key in standardTypes) {
        //If contents does not exist, or is empty, omit type from consideration. There is nothing we can throw, as all tiles are exposed.
        if (standardTypes[key].contents.length === 0) {
          continue;
        }

        results.push([key, standardTypes[key].value + standardTypes[key].weight]);
      }

      if (results.length !== 0) {
        strategy.results = results;
        results.sort(function (a, b) {
          return b[1] - a[1];
        }); //Highest value suits first.

        strategy.suit = results[0][0];
        strategy.throwSuit = results[results.length - 1][0]; //TODO: Only choose secondary suit if it would NOT result in breaking up a pong, etc.

        if (config.chooseSecondarySuit && results.length === 3) {
          strategy.throwSuit = results[1][0];
        }
      } else {
        //We have no normal suits. Honors for now.
        strategy.suit = "honor";
        strategy.throwSuit = "honor";
      }
    }

    if (strategy.suit !== "honor" && breakdown.honor && breakdown.honor.value + breakdown.honor.weight > standardTypes[strategy.suit].value / 2) {
      strategy.honors = true;
    }

    if (strategy.throwSuit === strategy.suit && strategy.honors === false) {
      strategy.throwSuit = "honor";
    }

    strategy.throw = (_breakdown$strategy$t = breakdown[strategy.throwSuit]) === null || _breakdown$strategy$t === void 0 ? void 0 : (_breakdown$strategy$t2 = _breakdown$strategy$t.contents) === null || _breakdown$strategy$t2 === void 0 ? void 0 : _breakdown$strategy$t2[0];
    breakdown.tiles = [];
    breakdown.contents = [];

    for (var suit in breakdown) {
      if (!breakdown[suit].tiles) {
        continue;
      }

      breakdown.tiles = breakdown.tiles.concat(breakdown[suit].tiles);
      breakdown.contents = breakdown.contents.concat(breakdown[suit].contents);
    }

    if (!strategy.throw) {
      console.warn("WARNING: A throw was not found through normal measures. Picking tile to avoid crash. ");
      breakdown.contents = prepForSelection(breakdown.contents);
      strategy.throw = breakdown.contents[0];
    }

    if (strategy.throw instanceof Match) {
      strategy.throw = strategy.throw.getComponentTile();
    } //One last check... If we have an in hand kong, place it.


    if (config.charleston === false) {
      breakdown.contents.forEach(function (item) {
        if (item.amount === 4) {
          strategy.throw = new Array(4).fill(item.getComponentTile());
        }
      });
    }

    breakdown.strategy = strategy;
    return breakdown;
  }

  function getCharlestonTiles() {
    var tiles = [];

    for (var _i2 = 0; _i2 < 3; _i2++) {
      var breakdown = computeHandBreakdown(currentHand.contents, currentHand.wind, {
        chooseSecondarySuit: Boolean(_i2 % 2),
        looseTileCost: 2,
        charleston: true
      }); //TODO: Base looseTileCost off of round.

      var strategy = breakdown.strategy;
      currentHand.removeMatchingTile(strategy.throw);
      tiles.push(strategy.throw);
    }

    tiles.forEach(function (tile) {
      currentHand.add(tile);
    });
    return tiles;
  }

  if (gameData.charleston) {
    //We need to choose 3 tiles.
    placeTiles(getCharlestonTiles());
  } else if (gameData.currentTurn.userTurn === this.clientId) {
    //We need to choose a discard tile.
    //TODO: We need to check if we should, and can, charleston (as of, we are east).
    var breakdown = computeHandBreakdown(currentHand.contents, currentHand.wind, {
      chooseSecondarySuit: false,
      looseTileCost: 5
    });

    if (currentHand.wind === "east" && room.state.settings.charleston.length > 0 && gameData.charleston !== false && room.state.settings.botSettings.canCharleston) {
      var values = ["circle", "character", "bamboo", "honor"].map(function (str) {
        var _breakdown$str;

        return ((_breakdown$str = breakdown[str]) === null || _breakdown$str === void 0 ? void 0 : _breakdown$str.value) || 0;
      });
      var max = Math.max.apply(Math, _toConsumableArray(values));

      if (max > 55) {
        //Very high bar for not charlestoning, as east charlestons with an extra tile, which extends advantage.
        placeTiles(breakdown.strategy.throw);
      } else {
        placeTiles(getCharlestonTiles());
      }
    } else {
      placeTiles(breakdown.strategy.throw);
    }
  } else if (gameData.currentTurn.thrown) {
    //We need to evaluate if we pick up the thrown tile.
    currentHand.add(gameData.currentTurn.thrown);
    var isMahjong = currentHand.isMahjong(room.state.settings.maximumSequences);
    var tile = gameData.currentTurn.thrown;

    if (isMahjong) {
      console.log("Naked Mahjong");
      currentHand.remove(gameData.currentTurn.thrown);
      return placeTiles([gameData.currentTurn.thrown], isMahjong); //Naked Mahjong.
    }

    if (currentHand.removeMatchingTilesFromHand(tile, 4, true)) {
      //TODO: Look at keeping for sequence.
      currentHand.remove(gameData.currentTurn.thrown);
      return placeTiles(new Array(4).fill(gameData.currentTurn.thrown), isMahjong);
    }

    if (currentHand.removeMatchingTilesFromHand(tile, 3, true)) {
      currentHand.remove(gameData.currentTurn.thrown);
      return placeTiles(new Array(3).fill(gameData.currentTurn.thrown), isMahjong);
    }

    if (isMahjong && currentHand.removeMatchingTilesFromHand(tile, 2, true)) {
      currentHand.remove(gameData.currentTurn.thrown);
      return placeTiles(new Array(2).fill(gameData.currentTurn.thrown), isMahjong);
    } //TODO: Look at making sequence.
    //Nothing we can do. Next.


    currentHand.remove(gameData.currentTurn.thrown);
    placeTiles([]);
  }
}

module.exports = evaluateNextMove;

/***/ }),

/***/ 6663:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2222);

__webpack_require__(6699);

__webpack_require__(2023);

var evaluateNextMoveChinese = __webpack_require__(5681);

var evaluateNextMoveAmerican = __webpack_require__(4497);

function handleMessage(_ref) {
  var type = _ref.type,
      message = _ref.message,
      status = _ref.status;

  if (type === "roomActionState") {
    var _this$getRoom, _this$getRoom$gameDat, _this$getRoom2, _this$getRoom2$gameDa, _this$getRoom2$gameDa2, _this$getRoom3, _this$getRoom3$gameDa, _this$getRoom3$gameDa2, _this$getRoom3$gameDa3, _this$getRoom4, _this$getRoom4$gameDa, _this$getRoom4$gameDa2;

    //This should be the only type of message we need to listen to.
    if ((_this$getRoom = this.getRoom()) !== null && _this$getRoom !== void 0 && (_this$getRoom$gameDat = _this$getRoom.gameData) !== null && _this$getRoom$gameDat !== void 0 && _this$getRoom$gameDat.isMahjong || (_this$getRoom2 = this.getRoom()) !== null && _this$getRoom2 !== void 0 && (_this$getRoom2$gameDa = _this$getRoom2.gameData) !== null && _this$getRoom2$gameDa !== void 0 && (_this$getRoom2$gameDa2 = _this$getRoom2$gameDa.wall) !== null && _this$getRoom2$gameDa2 !== void 0 && _this$getRoom2$gameDa2.isEmpty) {
      return; //The room is mahjong, nothing we should do.
    } //So that we can restore if bot crashes weirdly. Only a problem if there are 3+ bots, as otherwise, the turn can't proceed before this executes.


    var turnState = (_this$getRoom3 = this.getRoom()) === null || _this$getRoom3 === void 0 ? void 0 : (_this$getRoom3$gameDa = _this$getRoom3.gameData) === null || _this$getRoom3$gameDa === void 0 ? void 0 : (_this$getRoom3$gameDa2 = _this$getRoom3$gameDa.currentTurn) === null || _this$getRoom3$gameDa2 === void 0 ? void 0 : (_this$getRoom3$gameDa3 = _this$getRoom3$gameDa2.turnChoices) === null || _this$getRoom3$gameDa3 === void 0 ? void 0 : _this$getRoom3$gameDa3[this.clientId];
    var handState = (_this$getRoom4 = this.getRoom()) === null || _this$getRoom4 === void 0 ? void 0 : (_this$getRoom4$gameDa = _this$getRoom4.gameData) === null || _this$getRoom4$gameDa === void 0 ? void 0 : (_this$getRoom4$gameDa2 = _this$getRoom4$gameDa.playerHands) === null || _this$getRoom4$gameDa2 === void 0 ? void 0 : _this$getRoom4$gameDa2[this.clientId];

    try {
      var _this$getRoom5, _this$getRoom5$state, _this$getRoom5$state$;

      if (((_this$getRoom5 = this.getRoom()) === null || _this$getRoom5 === void 0 ? void 0 : (_this$getRoom5$state = _this$getRoom5.state) === null || _this$getRoom5$state === void 0 ? void 0 : (_this$getRoom5$state$ = _this$getRoom5$state.settings) === null || _this$getRoom5$state$ === void 0 ? void 0 : _this$getRoom5$state$.gameStyle) === "american") {
        evaluateNextMoveAmerican.call(this);
      } else {
        evaluateNextMoveChinese.call(this);
      }
    } catch (e) {
      if (turnState) {
        this.getRoom().gameData.currentTurn.turnChoices[this.clientId] = turnState;
      }

      if (handState) {
        this.getRoom().gameData.playerHands[this.clientId] = handState;
      }

      console.log("FATAL BOT ERROR: " + e);
      console.log(e.stack);
      this.getRoom().messageAll([this.clientId], "displayMessage", {
        title: "Bot Error",
        body: "".concat(this.getNickname(), " has encountered an error. You can manually control the bot <a target=\"_blank\" href=\"#clientId=").concat(this.clientId, "\">here</a>. ")
      });
    }
  } //Don't error on the manually control bot message (I believe it triggers all other bots to error otherwise), or when we can't place because another player had a higher priority placement.
  //If the message is not a string (no message.includes), ignore.


  if (status === "error" && message.includes && !message.includes("higher priority placement")) {
    this.getRoom().messageAll([this.clientId], "displayMessage", {
      title: "Bot Error",
      body: "".concat(this.getNickname(), " has received an error message. If it is not functioning, you can manually control the bot <a target=\"_blank\" href=\"#clientId=").concat(this.clientId, "\">here</a>. ")
    });
    console.error("Bot received an error message", message);
  }
}

module.exports = handleMessage;

/***/ }),

/***/ 927:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(7042);

__webpack_require__(3210);

__webpack_require__(5837);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(5735);

__webpack_require__(3753);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bot; //Don't want both scripts importing each other.

var Client = /*#__PURE__*/function () {
  "use strict";

  function Client(clientId, websocket) {
    _classCallCheck(this, Client);

    this.clientId = clientId;
    this.nickname = clientId.slice(0, 7);
    this.websocket = websocket;

    this.setWebsocket = function (websocket) {
      this.websocket = websocket;
    }.bind(this);

    this.setNickname = function (nickname) {
      //Leave their name as their client id if they don't pick a real one!
      if (nickname.trim()) {
        this.nickname = nickname.slice(0, 14); //Limit nicknames to 14 characters.
      }
    }.bind(this);

    this.getNickname = function () {
      return this.nickname;
    };

    this.suppressed = false;

    this.suppress = function () {
      this.suppressed = true;
    };

    this.unsuppress = function () {
      this.suppressed = false;
    };

    this.message = function message(type, message, status) {
      if (this.suppressed) {
        return;
      } //Also disable room.logFile (approx line 135, startGame.js)

      /*
      if (!this.lastSent) {this.lastSent = Date.now()}
      if (message?.isGameOver) {
      	if (this.getRoom().logFileSaveId === this.lastSaveId) {return}
      	else {this.lastSaveId = this.getRoom().logFileSaveId}
      		//console.log(message)
      	if (!this.total) {this.total = 0}
      	if (!this.tilesLeft) {this.tilesLeft = []}
      		this.tilesLeft.push(message.wallTiles.length ?? message.wallTiles) //TODO: Some zero might be mahjong, others wall empty. Apply that distinction.
      	this.total++
      		console.error(message.wallTiles.length, this.tilesLeft, this.total, this.tilesLeft.reduce((s, t) => s + t) / this.total)
      		if (this.total > 500) {require("process").exit("Bye!")}
      	setTimeout((function() {
      		this.endGame({})
      		this.startGame({type: "roomActionStartGame", settings: this.state.settings})
      	}).bind(this.getRoom()), 300)
      }
      else if (type === "roomActionState") {
      	require("./Bot/handleMessage.js").call(this, {type, message, status})
      	 //Suppress most messages. 5 second delay between real messages, so you can actually load the game to analyze.
      	if (Math.random() < 1 && this.getRoom().inGame && Date.now() - this.lastSent < 5000) {return}
      	else {this.lastSent = Date.now()}
      }*/


      if (!this.websocket) {
        //This should only happen if we loaded from state, as we would for testing.
        return;
      }

      try {
        //Handle errors where the websocket connection has closed.
        //We can probably do this simply by not sending the message, as the client should sync state if they disconnected.
        return this.websocket.send(JSON.stringify({
          type: type,
          message: message,
          status: status
        }));
      } catch (e) {
        console.error(e);
      }
    }.bind(this);

    this.delete = function (message) {
      try {
        websocket.close(1000); //Status code: Normal close.
      } catch (e) {}

      globalThis.serverStateManager.deleteClient(clientId);
    }.bind(this); //roomId should be removed once this client is removed from a room. Probably moot due to getRoomId checks though.


    this.setRoomId = function (roomId) {
      this.roomId = roomId;
    };

    this.getRoomId = function () {
      //Validate that the client is actually in the room...
      var room = globalThis.serverStateManager.getRoom(this.roomId);

      if (room && room.clientIds.includes(this.clientId)) {
        return this.roomId;
      }
    };

    this.getRoom = function () {
      return globalThis.serverStateManager.getRoom(this.getRoomId());
    };

    this.toJSON = function () {
      var obj = {
        clientId: this.clientId,
        nickname: this.nickname,
        roomId: this.roomId,
        isBot: this.isBot
      };
      return JSON.stringify(obj);
    }.bind(this);
  }

  _createClass(Client, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      //Create client from a string.
      var obj = JSON.parse(str);
      var client;

      if (obj.isBot) {
        if (!Bot) {
          Bot = __webpack_require__(463);
        }

        client = new Bot(obj.clientId);
      } else {
        client = new Client(obj.clientId);
      }

      client.setNickname(obj.nickname);
      client.setRoomId(obj.roomId);
      return client;
    }
  }]);

  return Client;
}();

module.exports = Client;

/***/ }),

/***/ 8258:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

__webpack_require__(4747);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(5837);

__webpack_require__(7042);

__webpack_require__(561);

__webpack_require__(9600);

__webpack_require__(5069);

__webpack_require__(2772);

__webpack_require__(7941);

__webpack_require__(4553);

__webpack_require__(2222);

__webpack_require__(9826);

__webpack_require__(5827);

__webpack_require__(9653);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(3123);

__webpack_require__(4916);

__webpack_require__(3210);

__webpack_require__(1249);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(1038);

__webpack_require__(8309);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Wall = __webpack_require__(6212);

var Hand = __webpack_require__(2169);

var Tile = __webpack_require__(2946);

var Match = __webpack_require__(9458);

var Pretty = __webpack_require__(4810);

var Sequence = __webpack_require__(7793);

var TileContainer = __webpack_require__(502);

var americanUtilities = __webpack_require__(2976);

var Room = /*#__PURE__*/function () {
  "use strict";

  function Room(roomId) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Room);

    //Note: If loading from state, this.init() must be called.
    this.state = state;
    this.roomId = this.state.roomId = roomId;
    this.state.settings = this.state.settings || {};
    console.log(state); //TODO: Currently, clientId of other users is shown to users in the same room, allowing for impersonation. This needs to be fixed by using different identifiers.

    this.clientIds = this.state.clientIds = this.state.clientIds || [];
    this.inGame = false;
    this.gameData = {};

    this.setInstructions = function (clientId, instructions) {
      var _this$gameData;

      if (!(this !== null && this !== void 0 && (_this$gameData = this.gameData) !== null && _this$gameData !== void 0 && _this$gameData.instructions)) {
        this.gameData.instructions = {};
      }

      this.gameData.instructions[clientId] = instructions;
    }.bind(this);

    this.setAllInstructions = function (excludeClientIds, instructions) {
      var _this = this;

      this.clientIds.forEach(function (clientId) {
        if (!excludeClientIds.includes(clientId)) {
          _this.setInstructions(clientId, instructions);
        }
      });
    }.bind(this);

    var _hostClientId;

    Object.defineProperty(this, "hostClientId", {
      set: function set(id) {
        _hostClientId = id;
        this.state.hostClientId = id;
      },
      get: function get() {
        return _hostClientId;
      }
    });
    this.hostClientId = this.state.hostClientId;
    this.state.moves = this.state.moves || [];

    var loadState = function loadState() {
      var _this2 = this;

      if (this.state.seed) {
        console.time("Loading Room State... "); //Make sure we don't blast all the clients with repeat messages.

        this.clientIds.forEach(function (clientId) {
          var client = globalThis.serverStateManager.getClient(clientId);
          client.suppress();

          if (client.getRoomId() === undefined) {
            client.setRoomId(_this2.roomId);
          }
        }.bind(this));

        var _moves = this.state.moves.slice(0);

        this.startGame({
          type: "roomActionStartGame",
          settings: this.state.settings
        });
        console.log(_moves); //These moves are going to get added back in...

        _moves.forEach(function (move) {
          _this2.onPlace.apply(_this2, _toConsumableArray(move));
        });

        this.clientIds.forEach(function (clientId) {
          globalThis.serverStateManager.getClient(clientId).unsuppress();
        });
        this.sendStateToClients();
        delete this.init;
        console.timeEnd("Loading Room State... ");
      }
    }.bind(this);

    this.init = loadState;
    this.startGame = __webpack_require__(3449).bind(this);
    this.addBot = __webpack_require__(8312).bind(this);
    var lastSummary;

    this.getSummary = function (mahjongClientId, drewOwnTile) {
      var summary = [];

      for (var id in this.gameData.playerHands) {
        var hand = this.gameData.playerHands[id];
        var item = "";
        item += globalThis.serverStateManager.getClient(id).getNickname();
        item += ": ";
        item += hand.wind;
        var points = hand.score();

        if (id === mahjongClientId) {
          if (this.state.settings.gameStyle === "american") {
            var hands = americanUtilities.getTileDifferential(this.gameData.card, hand.contents);
            hands.forEach(function (hand, index) {
              if (hand.diff === 0) {
                item += ", ";
                var handOption = hand.handOption;
                item += handOption.score + " points - " + handOption.section + " #" + (handOption.cardIndex + 1);
              }
            });
          } else {
            points = hand.score({
              isMahjong: true,
              drewOwnTile: drewOwnTile
            });
          }
        }

        if (this.state.settings.gameStyle === "chinese") {
          item += ", " + points + " points";
        }

        if (id === mahjongClientId) {
          item += " (Mahjong)" + (drewOwnTile ? " - Drew Mahjong Tile" : "");
          summary.splice(0, 0, item); //Insert at the start.
        } else {
          summary.push(item);
        }
      }

      lastSummary = summary.join("\n");
      return lastSummary;
    }.bind(this);

    var shouldRotateWinds = true;

    this.rotateWinds = function () {
      //We don't want to rotate until the game is actually ended - otherwise, we mess up state if the game is reverted.
      var winds = ["north", "east", "south", "west"].reverse();

      for (var clientId in this.state.settings.windAssignments) {
        var wind = this.state.settings.windAssignments[clientId];
        this.state.settings.windAssignments[clientId] = winds[(winds.indexOf(wind) + 1) % 4]; //Next in order
      }
    };

    this.goMahjong = function goMahjong(clientId) {
      var drewOwnTile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      //First, verify the user can go mahjong.
      var client = globalThis.serverStateManager.getClient(clientId);
      var hand = this.gameData.playerHands[clientId]; //On override, always allow unlimited (4) sequences, as if the overrides are purely sequence limits (forgot to change the setting,
      //the scoring will now be correct, not incorrect)

      var isMahjong = hand.isMahjong(override ? 4 : this.state.settings.maximumSequences);

      if (isMahjong instanceof Hand) {
        hand.contents = isMahjong.contents; //Autocomplete the mahjong.
      }

      if (!isMahjong && !override && this.state.settings.gameStyle !== "american") {
        return client.message("roomActionPlaceTiles", "Unable to go mahjong with this hand. If you play by different rules, try again to override. ", "error");
      } //The game is over.


      this.gameData.isMahjong = true;
      this.sendStateToClients(); //If East wins, do not rotate.

      if (this.state.settings.windAssignments[clientId] === "east") {
        shouldRotateWinds = false;
      }

      this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has gone mahjong", {
        clientId: clientId,
        speech: "Mahjong"
      });
      this.setAllInstructions([this.hostClientId], client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ");
      this.setInstructions(this.hostClientId, client.getNickname() + " has gone mahjong!\nPress End Game to return everybody to the room screen. ");
      this.messageAll([], "displayMessage", {
        title: "Mahjong!",
        body: this.getSummary(clientId, drewOwnTile)
      }, "success");
      this.sendStateToClients();
    }.bind(this);

    this.revertState = function (moveCount) {
      //Reverts state, removing moveCount moves
      //TODO: We probably want to save state here. Can we simply change the save ID or something?
      if (moveCount < 1) {
        return;
      } //Block revert by zero or negative numbers.


      globalThis.serverStateManager.deleteRoom(this.roomId);
      this.state.moves = this.state.moves.slice(0, -moveCount);
      var room = new Room(this.roomId, this.state);
      globalThis.serverStateManager.createRoom(this.roomId, room);
      room.init();
    }.bind(this);

    this.turnChoicesProxyHandler = {
      set: __webpack_require__(5392).bind(this)
    };

    var getState = function getState(requestingClientId) {
      var _this$gameData2,
          _this$gameData3,
          _this$gameData3$wall,
          _this$gameData4,
          _this$gameData4$instr,
          _this3 = this;

      //Generate the game state visible to requestingClientId
      var state = {};
      state.inGame = this.inGame;
      state.isHost = requestingClientId === this.hostClientId;

      if (this.gameData.wall) {
        //Pass tiles if mahjong, else number of tiles.
        state.wallTiles = this.gameData.wall.tiles;

        if (!this.gameData.isMahjong) {
          state.wallTiles = state.wallTiles.length;
        }
      }

      state.isGameOver = (this === null || this === void 0 ? void 0 : (_this$gameData2 = this.gameData) === null || _this$gameData2 === void 0 ? void 0 : _this$gameData2.isMahjong) || (this === null || this === void 0 ? void 0 : (_this$gameData3 = this.gameData) === null || _this$gameData3 === void 0 ? void 0 : (_this$gameData3$wall = _this$gameData3.wall) === null || _this$gameData3$wall === void 0 ? void 0 : _this$gameData3$wall.isEmpty);
      state.settings = this.state.settings;
      state.instructions = (this === null || this === void 0 ? void 0 : (_this$gameData4 = this.gameData) === null || _this$gameData4 === void 0 ? void 0 : (_this$gameData4$instr = _this$gameData4.instructions) === null || _this$gameData4$instr === void 0 ? void 0 : _this$gameData4$instr[requestingClientId]) || "";
      state.discardPile = this.gameData.discardPile;

      if (this.gameData.currentTurn) {
        state.currentTurn = {
          thrown: this.gameData.currentTurn.thrown,
          userTurn: this.gameData.currentTurn.userTurn,
          playersReady: Object.keys(this.gameData.currentTurn.turnChoices || {})
        }; //Pass the last drawn tile to the person requesting.
        //Last drawn tile is cleared every throw to avoid leaking information and stop showing the tile as drawn.

        if (requestingClientId === this.gameData.currentTurn.userTurn) {
          state.currentTurn.lastDrawn = this.lastDrawn;
        }

        if (this.gameData.charleston) {
          state.currentTurn.charleston = true;
        }
      }

      state.clients = [];
      this.clientIds.slice(0, state.inGame ? 4 : Infinity).forEach(function (currentClientId) {
        var visibleClientState = {
          id: currentClientId,
          nickname: globalThis.serverStateManager.getClient(currentClientId).getNickname(),
          isHost: currentClientId === _this3.hostClientId
        };

        if (_this3.inGame) {
          var hand = _this3.gameData.playerHands[currentClientId];

          if (requestingClientId === currentClientId) {
            //One can see all of their own tiles.
            visibleClientState.hand = hand;
          } else {
            if (!_this3.gameData.isMahjong && !_this3.gameData.wall.isEmpty) {
              //One can only see exposed tiles of other players. True says to include other tiles as face down.
              visibleClientState.visibleHand = hand.getExposedTiles(true);
            } else {
              //Game over. Show all.
              visibleClientState.visibleHand = hand.contents;
            }

            visibleClientState.wind = hand.wind;
          }
        }

        state.clients.push(visibleClientState);
      });
      return state;
    }.bind(this);

    this.sendStateToClients = function sendStateToClients() {
      this.clientIds.forEach(function (clientId) {
        var client = globalThis.serverStateManager.getClient(clientId);
        var state = getState(clientId);
        client.message("roomActionState", state, "success");
      });
    }.bind(this);

    this.addClient = function (clientId) {
      var client = globalThis.serverStateManager.getClient(clientId);

      if (this.clientIds.includes(clientId)) {
        return client.message("joinRoom", "Already In Room", "error");
      }

      client.setRoomId(this.roomId);
      client.message("joinRoom", this.roomId, "success");

      if (!this.hostClientId) {
        this.hostClientId = clientId;
      }

      this.clientIds.push(clientId);
      this.sendStateToClients();
      return true;
    }.bind(this);

    this.removeClient = function (clientId) {
      var _this4 = this;

      var explaination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "You left the room. ";
      var clientIdIndex = this.clientIds.findIndex(function (currentClientId) {
        return currentClientId === clientId;
      });

      if (clientIdIndex === -1) {
        return "Client Not Found";
      } else {
        this.clientIds.splice(clientIdIndex, 1);

        if (this.hostClientId === clientId) {
          //Choose a new host client. Make sure NOT to pick a bot.
          this.hostClientId = null;
          this.clientIds.forEach(function (clientId) {
            if (_this4.hostClientId) {
              return;
            }

            if (!globalThis.serverStateManager.getClient(clientId).isBot) {
              _this4.hostClientId = clientId;
            }
          }.bind(this));
        }

        this.sendStateToClients();
        var clientBeingKicked = globalThis.serverStateManager.getClient(clientId);

        if (clientBeingKicked) {
          clientBeingKicked.message("roomActionLeaveRoom", explaination, "success"); //The client is going to change their client Id. We can now delete the old client.

          globalThis.serverStateManager.deleteClient(clientId);
        }

        if (this.hostClientId === null) {
          //We have no clients. Delete this room.
          //Note that this code shouldn't be called, unless there is a bug or lag. The client will not show the Leave Room button if they are the
          //only player and host (which they should be if they are the only player), and therefore roomActionCloseRoom will be sent instead.
          globalThis.serverStateManager.deleteRoom(this.roomId);
        }
      }
    }.bind(this);

    this.messageAll = function () {
      var exclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.clientIds.forEach(function (clientId) {
        if (exclude.includes(clientId)) {
          return;
        }

        var client = globalThis.serverStateManager.getClient(clientId);
        client.message.apply(client, args);
      });
    }.bind(this);

    this.drawTile = function drawTile(clientId) {
      var doNotMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var tile;
      var pretty = -1;

      while (!(tile instanceof Tile)) {
        pretty++;
        tile = this.gameData.wall.drawFirst();

        if (!tile) {
          console.log("Wall Empty");
          this.messageAll([], "displayMessage", {
            title: "Game Over - Wall Empty",
            body: this.getSummary()
          }, "success");
          this.setInstructions([this.hostClientId], "The Wall is empty. \nPress End Game to return everybody to the room screen. ");
          this.setInstructions(this.hostClientId, "The Wall is empty. \nPress End Game to return everybody to the room screen. Press New Game to play again with the same settings. ");
          this.gameData.wall.isEmpty = true;
          this.sendStateToClients(); //Game over. Wall empty.

          return;
        }

        this.gameData.playerHands[clientId].add(tile);
      }

      var client = globalThis.serverStateManager.getClient(clientId);

      if (!doNotMessage) {
        this.lastDrawn = tile;
        this.setInstructions(client.clientId, "You drew " + ((pretty > 0 ? pretty === 1 ? "a pretty and a " : pretty + " prettys and a " : "a ") + tile.getTileName(this.state.settings.gameStyle)) + ". To discard, select a tile and press proceed. To kong, select 4 matching tiles and press Proceed. If you are Mahjong, press Mahjong. ");

        if (pretty > 0) {
          this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " drew " + (pretty === 1 ? "a pretty!" : pretty + " prettys!"), {
            clientId: clientId,
            speech: "I'm pretty!"
          });
        }
      } else if (pretty > 0) {
        //If doNotMessage is passed, this is beginning of game setup. We won't send anything other than "You drew a pretty" to avoid having multiple overlapping pieces of text.
        client.message("roomActionGameplayAlert", "You drew a pretty!", "success");
      }
    }.bind(this);

    this.endGame = function endGame(obj, clientId) {
      var gameEndMessage = "The Game Has Ended";

      if (clientId) {
        var client = globalThis.serverStateManager.getClient(clientId); //Tell players who ended the game.

        gameEndMessage = "The game has been ended by " + client.getNickname() + ".";
      }

      if (shouldRotateWinds) {
        this.rotateWinds();
      }

      shouldRotateWinds = true;
      this.inGame = false;
      delete this.state.seed;
      delete this.state.wall; //Without a seed, moves won't be evaluated, as no wall can be constructed.

      this.state.moves = [];
      this.gameData = {};
      this.messageAll([clientId], obj.type, gameEndMessage, "success");
      this.sendStateToClients();
    }.bind(this);

    var placerMahjongOverride = false;
    var placerSequenceOverride = false;

    this.onPlace = function (obj, clientId) {
      var _this5 = this;

      //Obj.message - a Tile, Match, or Sequence
      var move = [obj, clientId];
      this.state.moves.push(move);

      if (this.logFile) {
        try {
          this.logFile.write(JSON.stringify(move) + "\n");
        } catch (e) {
          console.error("ERROR WRITING TO ROOM LOGFILE: ", e);
        }
      }

      var client = globalThis.serverStateManager.getClient(clientId);
      var hand = this.gameData.playerHands[clientId];

      if (this.gameData.isMahjong) {
        return client.message("displayMessage", {
          title: "Mahjong!",
          body: lastSummary
        });
      } else if (this.gameData.wall.isEmpty) {
        return client.message("displayMessage", {
          title: "Game Over - Wall Empty",
          body: lastSummary
        });
      }

      if (!hand) {
        return client.message("displayMessage", {
          title: "Access Denied",
          body: "It appears that you spectating. "
        });
      }

      var placement;

      try {
        placement = Hand.convertStringsToTiles(obj.message);

        if (this.state.settings.charleston.length > 0 && this.gameData.charleston === undefined && placement.length !== 1 && hand.wind === "east") {
          if (placement.length === 3) {
            this.gameData.charleston = {
              directions: this.state.settings.charleston.slice(0)
            };
            this.setAllInstructions([], "Welcome to the Charleston. Select 3 tiles you would like to pass " + this.gameData.charleston.directions[0][0].direction + ", then hit Proceed. ", "success");
            this.messageAll([], "roomActionGameplayAlert", "The first Charleston pass is " + nextDirection.direction, "success");
          } else if (!obj.mahjong) {
            return client.message(obj.type, "The very first throw must be either 1 tile, to initiate the game, or 3 tiles, to initiate charleston. ", "error");
          } else if (obj.mahjong) {
            placement = undefined;
          }
        } else if (this.gameData.charleston) {} else if (placement.length > 1) {
          if (this.state.settings.gameStyle === "american") {
            //TileContainers bypass everything, which American Mahjong needs right now.
            placement = new TileContainer({
              tiles: placement
            });
          } else if (Match.isValidMatch(placement)) {
            placement = new Match({
              exposed: true,
              amount: placement.length,
              type: placement[0].type,
              value: placement[0].value
            });
          } else if (Sequence.isValidSequence(placement)) {
            placement = new Sequence({
              exposed: true,
              tiles: placement
            });
          } else {
            return client.message(obj.type, "Unable to create a sequence, or match. Please check your tiles. ", "error");
          }
        } else {
          placement = placement[0];
          this.gameData.charleston = this.gameData.charleston || false;
        }
      } catch (e) {
        return client.message(obj.type, "Error: " + e.message, "error");
      } //The users wishes to place down tiles.
      //If it is not their turn, we will hold until all other players have either attempted to place or nexted.
      //Then we will apply priority.


      if (placement instanceof Array) {
        //This should only happen if we are in a charleston. Remove the charleston tiles from their hand.
        if (this.gameData.currentTurn.turnChoices[clientId]) {
          return client.message(obj.type, "You have already passed tiles for this charleston round. ", "error");
        }

        this.gameData.currentTurn.turnChoices[clientId] = placement;
        this.sendStateToClients();
      } else if (this.gameData.currentTurn.thrown === false || this.gameData.currentTurn.thrown === undefined) {
        if (clientId !== this.gameData.currentTurn.userTurn) {
          //This player is not allowed to perform any actions at this stage.
          return client.message(obj.type, "Can't place after draw before throw", "error");
        }

        if (placement instanceof Tile) {
          if (obj.mahjong) {
            return client.message(obj.type, "You can't discard and go mahjong. ", "error");
          }

          if (hand.removeMatchingTilesFromHand(placement)) {
            //If this is the 4th tile for an exposed pong in this hand, we will turn it into a kong and draw another tile.
            //TODO: Note that it is remotely possible players will want to throw the 4th tile instead, as it is a very safe (if honor, entirely safe), throw.
            //This would mean sacraficing points and a draw in order to get a safe throw, and I have never seen it done, but there are scenarios where it may
            //actually be the best idea. We should probably allow this at some point.
            if (hand.contents.some(function (item) {
              if (item instanceof Match && item.type === placement.type && item.value === placement.value) {
                item.amount = 4;

                _this5.drawTile(clientId);

                return true;
              }

              return false;
            }.bind(this))) {
              this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has upgraded an exposed pong into a kong. ", {
                clientId: clientId,
                speech: "Make that a kong",
                durationMultiplier: 1.1
              }); //Add duation. Long speech.

              this.sendStateToClients();
              return;
            }

            if (obj.swapJoker) {
              //We're going to try to swap this discard out for a joker if possible.
              //Bots can pass true to auto-detect and not receive errors on fail.
              var clientIds;

              if (obj.swapJoker === true) {
                clientIds = [clientId].concat(this.clientIds); //This is 5 clientIds - but it doesn't matter since we'll short circuit.
              } else if (this.clientIds.indexOf(obj.swapJoker) !== -1) {
                clientIds = [obj.swapJoker];
              } else {
                return client.message(obj.type, "Unable to identify which player you want to swap with. ", "error");
              }

              var res = clientIds.some(function (clientId) {
                var swapWithHand = _this5.gameData.playerHands[clientId];
                return swapWithHand.contents.some(function (item) {
                  if (item.exposed) {
                    //In American Mahjong, the only tiles that can be called for are pongs, kongs, quints, and sextets.
                    //Therefore, the jokers must match the other tiles exposed.
                    var tile = item.tiles.find(function (tile) {
                      return tile.type !== "joker";
                    });
                    var jokerIndex = item.tiles.findIndex(function (tile) {
                      return tile.type === "joker";
                    });

                    if (jokerIndex !== -1 && tile.matches(placement)) {
                      //Swap the joker for this tile
                      hand.add(item.tiles[jokerIndex]);
                      item.tiles.splice(jokerIndex, 1);
                      item.tiles.push(placement);
                      return true;
                    }
                  }
                });
              });

              if (res) {
                //Swapped for a joker
                client.message("roomActionGameplayAlert", "Successfully Swapped", {
                  clientId: clientId,
                  speech: "Swapped",
                  durationMultiplier: 0.5
                });
                this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has swapped a " + placement.getTileName(this.state.settings.gameStyle) + " for a joker", {
                  clientId: clientId,
                  speech: "Swap",
                  durationMultiplier: 1
                });
                return this.sendStateToClients();
              } else {
                if (obj.swapJoker !== true) {
                  hand.add(placement); //Restore the hand.
                  //Couldn't swap - send error.

                  return client.message(obj.type, "Could not find a joker to swap with. ", "error");
                }
              }
            } //Bots can pass true to auto-detect and not receive errors on fail.
            //Confirm this is either a bot or a normal discard - if a person fails to joker swap, we refund their tile.


            if (!obj.swapJoker || obj.swapJoker === true) {
              var tileName = placement.getTileName(this.state.settings.gameStyle);
              var discardMessage = client.getNickname() + " has thrown a " + tileName; //We're also going to check if the discarder is calling.

              var durationMultiplier = 1;

              if (this.state.settings.checkForCalling && !hand.calling && hand.isCalling(this.gameData.discardPile, this.state.settings.maximumSequences)) {
                hand.calling = true;
                discardMessage += ", and is calling";
                durationMultiplier = 1.5;
              } //Discard tile.


              this.gameData.currentTurn.thrown = placement;
              delete this.lastDrawn;
              this.gameData.currentTurn.turnChoices[clientId] = "Next";
              placerMahjongOverride = false;
              this.messageAll([clientId], "roomActionGameplayAlert", discardMessage, {
                clientId: clientId,
                speech: tileName,
                durationMultiplier: durationMultiplier,
                optional: !hand.calling
              });
              this.setAllInstructions([clientId], discardMessage + ". To skip, press Proceed. To claim this tile, select the tiles you are placing it with, and press Proceed (or Mahjong if this tile makes you Mahjong). ");
              this.sendStateToClients();
            }
          } else {
            return client.message(obj.type, "You can't place a tile you do not possess - try reloading the page or restarting the app", "error");
          }
        } else if (placement instanceof Match) {
          if (placement.amount === 4) {
            if (obj.mahjong) {
              return client.message(obj.type, "You can't go mahjong while placing a kong. ", "error");
            }

            if (hand.removeMatchingTilesFromHand(placement.getComponentTile(), 4)) {
              //Place Kong. Turn remains the same, thrown false.
              hand.contents.push(placement); //This must be an in hand kong, therefore we do not expose, although in hand kongs will be shown.

              placement.exposed = false; //Draw them another tile.

              this.drawTile(clientId);
              this.sendStateToClients();
              this.messageAll([clientId], "roomActionGameplayAlert", client.getNickname() + " has placed an in-hand kong of " + placement.getTileName(this.state.settings.gameStyle) + "s", {
                clientId: clientId,
                speech: "kong"
              });
              console.log("Kong");
            } else {
              return client.message(obj.type, "You can't place tiles you do not possess - try reloading the page or restarting the app", "error");
            }
          } else {
            return client.message(obj.type, "Can't expose in hand pong, sequence, or pair. This can only be done via mahjong.", "error");
          }
        } else if (obj.mahjong) {
          this.goMahjong(clientId, !this.gameData.previousTurnPickedUp, placerMahjongOverride);

          if (globalThis.serverStateManager.getClient(clientId).isBot) {
            console.log("Bots are not allowed to obtain override power");
          } else {
            placerMahjongOverride = true;
          }
        } else {
          //TODO: This triggers attempting to place an in hand sequence. This is the wrong error message, although it is an error.
          return client.message(obj.type, "Invalid placement attempt for current game status", "error");
        }
      } else if (placement === undefined) {
        if (this.gameData.charleston) {
          return globalThis.serverStateManager.getClient(clientId).message("roomActionPlaceTiles", "You must choose 3 tiles to pass during charleston. ", "error");
        }

        this.gameData.currentTurn.turnChoices[clientId] = "Next";
        this.sendStateToClients();
      } else {
        //This is not a discard, and it related to a throw, so must either be a pong, kong, sequence, or a pair if the user is going mahjong.
        if (obj.mahjong) {
          //Naked Mahjong
          placement.mahjong = obj.mahjong;
        } else if (!(placement instanceof Match || placement instanceof Sequence || placement instanceof TileContainer)) {
          return client.message(obj.type, "You can't discard when it is not your turn", "error");
        } else if (placement instanceof Sequence && !placerSequenceOverride) {
          var sequenceCount = hand.contents.reduce(function (amount, item) {
            if (item instanceof Sequence) {
              return ++amount;
            }

            return amount;
          }, 0);

          if (sequenceCount >= this.state.settings.maximumSequences) {
            placerSequenceOverride = true; //TODO: We should probably turn this override off at some point.

            return client.message(obj.type, "Host game settings allow only " + this.state.settings.maximumSequences + " sequence(s). Repeat your same move to ignore this setting, and place this sequence. Overriding this setting may cause minor issues in scoring, and may require a Mahjong override. ", "error");
          }
        } //Schedule the order. It's validity will be checked later.


        this.gameData.currentTurn.turnChoices[clientId] = placement;
        this.sendStateToClients();
      }
    }.bind(this);

    this.onIncomingMessage = function (clientId, obj) {
      var _this6 = this;

      var client = globalThis.serverStateManager.getClient(clientId);
      var isHost = clientId === this.hostClientId;

      if (obj.type === "roomActionLeaveRoom") {
        return this.removeClient(clientId);
      } else if (obj.type === "roomActionKickFromRoom") {
        //Only the host can kick, and only if the game has not started.
        if (!isHost) {
          console.log(client);
          console.log(client.message);
          return client.message(obj.type, "Only Host Can Kick", "error");
        }

        if (this.inGame) {
          return client.message(obj.type, "Can't Kick During Game", "error");
        }

        this.removeClient(obj.id, "You have been kicked from the room. "); //obj.id is the id of the user to kick.

        return client.message(obj.type, "Kicked Client", "success");
      } else if (obj.type === "roomActionStartGame") {
        if (!isHost) {
          return client.message("displayMessage", {
            title: "Error Starting Game",
            body: "Only Host Can Start"
          });
        }

        if (this.inGame) {
          return client.message("displayMessage", {
            title: "Error Starting Game",
            body: "Already in Game"
          });
        } //Time to start the game.


        var res = this.startGame(obj);

        if (typeof res === "string") {
          //Strings are error messages.
          return client.message("displayMessage", {
            title: "Error Starting Game",
            body: res
          });
        }

        return;
      } else if (obj.type === "roomActionEndGame") {
        //Anybody can end the game, as they could do the same going AFK.
        if (!this.inGame) {
          return client.message(obj.type, "No Game In Progress", "error");
        }

        if (this.clientIds.indexOf(clientId) > 3) {
          return this.removeClient(clientId);
        }

        this.endGame(obj, clientId); //Clientid is an optional parameter.
      } else if (obj.type === "roomActionCloseRoom") {
        if (!isHost) {
          return client.message(obj.type, "Only Host Can Close Room", "error");
        }

        var hostClientId = this.hostClientId; //Host may change as people are removed.

        this.clientIds.slice(0).forEach(function (clientId) {
          if (clientId !== hostClientId) {
            //Clone array to avoid shifting.
            _this6.removeClient(clientId, "The room has been closed. ");
          }
        });
        this.removeClient(hostClientId, "You closed the room. ");
        globalThis.serverStateManager.deleteRoom(this.roomId);
      } else if (obj.type === "roomActionPlaceTiles") {
        //Action to place tiles.
        //Only current turn user can place.
        return this.onPlace(obj, clientId);
      } else if (obj.type === "roomActionAddBot") {
        if (!isHost) {
          return client.message(obj.type, "Only Host Can Add Bots", "error");
        }

        return this.addBot(obj);
      } else if (obj.type === "roomActionRevertState") {
        if (this.clientIds.indexOf(clientId) > 3) {
          return client.message("displayMessage", {
            title: "Access Denied",
            body: "It appears that you spectating. "
          });
        }

        if (!isNaN(obj.message)) {
          this.messageAll([], "roomActionGameplayAlert", client.getNickname() + " is reverting the state " + Number(obj.message) + " moves. ", "success");
          return this.revertState(Number(obj.message));
        }

        return client.message("roomActionGameplayAlert", "Invalid Reversion Amount", "error");
      } else if (obj.type === "roomActionState") {
        return client.message(obj.type, getState(clientId), "success");
      } else if (obj.type === "roomActionChangeNickname") {
        var message; //Message will remain undefined if the user does not have permission to rename.

        var target = globalThis.serverStateManager.getClient(obj.targetId);

        if (obj.targetId === clientId) {
          message = target.getNickname() + " renamed to " + obj.nickname;
        } else if (isHost) {
          message = "The host renamed " + target.getNickname() + " to " + obj.nickname;
        }

        if (message) {
          target.setNickname(obj.nickname);
          this.messageAll([clientId], "roomActionGameplayAlert", message, "success");
          this.sendStateToClients();
        }

        return;
      }
    }.bind(this);

    this.toJSON = function () {
      var moves = this.state.moves;
      delete this.state.moves;
      var str = JSON.stringify(this.state);
      this.state.moves = moves;
      str += "\n";
      this.state.moves.forEach(function (move) {
        str += JSON.stringify(move) + "\n";
      });
      return str;
    }.bind(this);
  } //Files have the moves after - they aren't all in one place.


  _createClass(Room, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      var lines = str.trim().split("\n");
      var obj = JSON.parse(lines[0]);
      var moves = lines.slice(1);
      moves = moves.map(function (str) {
        return JSON.parse(str);
      });
      obj.moves = moves;
      return new Room(obj.roomId, obj);
    }
  }]);

  return Room;
}();

module.exports = Room;

/***/ }),

/***/ 8312:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(5837);

function addBot(obj) {
  //Create a clientId for the bot.
  var client = globalThis.serverStateManager.createBot();

  if (obj.botName) {
    client.setNickname(obj.botName);
  }

  client.setRoomId(this.roomId);
  this.addClient(client.clientId);
  this.sendStateToClients();
}

module.exports = addBot;

/***/ }),

/***/ 3449:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(6699);

__webpack_require__(9653);

__webpack_require__(7042);

__webpack_require__(9600);

__webpack_require__(5837);

__webpack_require__(2023);

__webpack_require__(2772);

__webpack_require__(561);

__webpack_require__(4747);

__webpack_require__(2707);

__webpack_require__(2222);

var Wall = __webpack_require__(6212);

var Hand = __webpack_require__(2169);

var cards = __webpack_require__(6587); //TODO: These can take a while to load, delaying the room creation (when startGame.js is imported)


var fs;
var path;

try {
  fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {
  console.warn(e);
}

function startGame(obj) {
  if (this.clientIds.length < 4) {
    return "Not Enough Clients";
  } else {
    var _obj$settings, _obj$settings3, _obj$settings$botSett, _obj$settings4, _obj$settings4$botSet, _obj$settings$checkFo, _obj$settings5, _obj$settings6;

    if (["chinese", "american"].includes(obj === null || obj === void 0 ? void 0 : (_obj$settings = obj.settings) === null || _obj$settings === void 0 ? void 0 : _obj$settings.gameStyle)) {
      var _obj$settings2;

      this.state.settings.gameStyle = obj === null || obj === void 0 ? void 0 : (_obj$settings2 = obj.settings) === null || _obj$settings2 === void 0 ? void 0 : _obj$settings2.gameStyle;
    } else {
      return "You must select either Chinese or American Mahjong in Game Settings (scroll down if not visible). ";
    }

    this.inGame = true;
    this.messageAll([], obj.type, "Game Started", "success"); //Set settings
    //TODO: This is probably the best default. We want a setting.

    this.state.settings.charleston = [[{
      direction: "across"
    }, {
      direction: "right"
    }, {
      direction: "left" //TODO: Allow Blind?

    }]];
    this.state.settings.botSettings = this.state.settings.botSettings || {};
    this.state.settings.disableHints = (obj === null || obj === void 0 ? void 0 : (_obj$settings3 = obj.settings) === null || _obj$settings3 === void 0 ? void 0 : _obj$settings3.disableHints) || false;
    this.state.settings.botSettings.canCharleston = (_obj$settings$botSett = obj === null || obj === void 0 ? void 0 : (_obj$settings4 = obj.settings) === null || _obj$settings4 === void 0 ? void 0 : (_obj$settings4$botSet = _obj$settings4.botSettings) === null || _obj$settings4$botSet === void 0 ? void 0 : _obj$settings4$botSet.canCharleston) !== null && _obj$settings$botSett !== void 0 ? _obj$settings$botSett : false;
    this.state.settings.windAssignments = this.state.settings.windAssignments || {};
    this.state.settings.checkForCalling = (_obj$settings$checkFo = obj === null || obj === void 0 ? void 0 : (_obj$settings5 = obj.settings) === null || _obj$settings5 === void 0 ? void 0 : _obj$settings5.checkForCalling) !== null && _obj$settings$checkFo !== void 0 ? _obj$settings$checkFo : true;

    if (!isNaN(obj === null || obj === void 0 ? void 0 : (_obj$settings6 = obj.settings) === null || _obj$settings6 === void 0 ? void 0 : _obj$settings6.maximumSequences)) {
      var _obj$settings7;

      this.state.settings.maximumSequences = Math.max(0, Math.round(Number(obj === null || obj === void 0 ? void 0 : (_obj$settings7 = obj.settings) === null || _obj$settings7 === void 0 ? void 0 : _obj$settings7.maximumSequences)));
    } else {
      this.state.settings.maximumSequences = 4;
    } //Build the wall.


    this.state.seed = this.state.seed || Math.random();

    if (this.state.settings.gameStyle === "chinese") {
      this.gameData.wall = new Wall(this.state.seed);
    } else if (this.state.settings.gameStyle === "american") {
      var _obj$settings8, _obj$settings11;

      this.gameData.wall = new Wall(this.state.seed, {
        prettysAsTiles: true,
        includeJokers: 8
      });
      this.state.settings.checkForCalling = false;
      this.state.settings.charleston = [[{
        direction: "right"
      }, {
        direction: "across"
      }, {
        direction: "left",
        blind: true
      }], [{
        direction: "left",
        allAgree: true
      }, {
        direction: "across"
      }, {
        direction: "right",
        blind: true
      }], [{
        direction: "across",
        blind: true
      }]];

      if (cards[obj === null || obj === void 0 ? void 0 : (_obj$settings8 = obj.settings) === null || _obj$settings8 === void 0 ? void 0 : _obj$settings8.card]) {
        var _obj$settings9;

        this.state.settings.card = obj === null || obj === void 0 ? void 0 : (_obj$settings9 = obj.settings) === null || _obj$settings9 === void 0 ? void 0 : _obj$settings9.card;
      } else {
        var _obj$settings10;

        console.error("Unknown Card", obj === null || obj === void 0 ? void 0 : (_obj$settings10 = obj.settings) === null || _obj$settings10 === void 0 ? void 0 : _obj$settings10.card);
        this.state.settings.card = "2021 National Mahjongg League";
      }

      this.gameData.card = cards[this.state.settings.card];
      this.gameData.charleston = {
        directions: this.state.settings.charleston.slice(0)
      };
      this.state.settings.americanBotDifficulty = Math.max(0, Number(obj === null || obj === void 0 ? void 0 : (_obj$settings11 = obj.settings) === null || _obj$settings11 === void 0 ? void 0 : _obj$settings11.americanBotDifficulty));

      if (isNaN(this.state.settings.americanBotDifficulty)) {
        this.state.settings.americanBotDifficulty = 50;
      }
    } else {
      throw "Unknown gameStyle";
    }

    this.state.hostClientId = this.hostClientId;
    this.state.moves = [];
    this.logFileSaveId = this.roomId + "-" + Date.now();

    if (fs) {
      //Comment below line out for all bot game testing.
      this.logFile = fs.createWriteStream(path.join(globalThis.serverStateManager.serverDataDirectory, this.logFileSaveId + ".room"));
    }

    this.gameData.discardPile = [];
    this.gameData.playerHands = {}; //Build the player hands.
    //For now, we will randomly assign winds.
    //windAssignments is clientId: wind

    var winds = ["north", "east", "south", "west"];
    var winds2 = winds.slice(0); //Clone used for ordering bots below.

    var windAssignments = {};

    for (var clientId in this.state.settings.windAssignments) {
      var wind = this.state.settings.windAssignments[clientId];

      if (this.clientIds.includes(clientId)) {
        var windIndex = winds.indexOf(wind); //If two clientIds have the same wind, we need to exclude one.

        if (windIndex !== -1) {
          winds.splice(windIndex, 1);
          windAssignments[clientId] = wind;
        }
      }
    } //Order bots alphabetically
    //This makes sure that something like Bot 1, Bot 2, Bot 3 always goes the same direction.
    //We should do this by changing the names - names aren't saved in state, so we aren't changing
    //anything that is going to cause issues with debugging (where bots might be sorted differently when
    //the names were generated from clientIds)


    var botNames = [];
    var botIds = [];
    var clientIds = [];
    this.clientIds.slice(0, 4).forEach(function (clientId) {
      if (!windAssignments[clientId]) {
        windAssignments[clientId] = winds.splice(Math.floor(Math.random() * winds.length), 1)[0];
      }

      var client = globalThis.serverStateManager.getClient(clientId);

      if (client.isBot) {
        botNames.push(client.getNickname());
        botIds.push(clientId);
      } else {
        clientIds.push(clientId);
      }
    }); //Place bots based on alphabetically ordered clientIds.

    clientIds = clientIds.sort();
    botNames = botNames.sort();
    var userWindIndex = winds2.indexOf(windAssignments[clientIds[0]]);

    if (userWindIndex === -1) {
      userWindIndex = 0;
    }

    winds2 = winds2.slice(userWindIndex).concat(winds2.slice(0, userWindIndex));
    botIds = botIds.sort(function (a, b) {
      return winds2.indexOf(windAssignments[a]) - winds2.indexOf(windAssignments[b]);
    });
    botIds.forEach(function (botId, index) {
      globalThis.serverStateManager.getClient(botId).setNickname(botNames[index]);
    });
    var eastWindPlayerId;

    for (var _clientId in windAssignments) {
      var _wind = windAssignments[_clientId];
      var hand = new Hand({
        wind: _wind
      });
      this.gameData.playerHands[_clientId] = hand;
      var tileCount = 13;

      if (_wind === "east") {
        eastWindPlayerId = _clientId;
        tileCount = 14;
      }

      for (var i = 0; i < tileCount; i++) {
        this.drawTile(_clientId, true);
      }
    }

    this.state.settings.windAssignments = windAssignments;
    this.gameData.currentTurn = {
      thrown: false,
      userTurn: eastWindPlayerId
    };
    this.gameData.currentTurn.turnChoices = new Proxy({}, this.turnChoicesProxyHandler);

    if (this.logFile) {
      this.logFile.write(JSON.stringify(this.state) + "\n");
    }

    console.log(this.gameData.charleston.directions);
    var direction = this.gameData.charleston.directions[0][0].direction;
    console.log(direction);

    if (this.state.settings.gameStyle === "chinese") {
      //Message East about how to start.
      this.setInstructions(this.gameData.currentTurn.userTurn, "As East wind, you get to make the first throw. Select one tile and press Proceed.\n\nTo initiate a Charleston (first pass ".concat(direction, "), select 3 tiles and hit Proceed."));
      this.setAllInstructions([this.gameData.currentTurn.userTurn], "Waiting on East Wind to make a play. ");
    } else if (this.state.settings.gameStyle === "american") {
      this.setAllInstructions([], "Welcome to the Charleston. Select 3 tiles you would like to pass " + direction + ", then hit Proceed. ", "success");
      this.messageAll([], "roomActionGameplayAlert", "The first Charleston pass is " + direction, "success");
    }

    this.sendStateToClients();
  }
}

module.exports = startGame;

/***/ }),

/***/ 5392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2772);

__webpack_require__(5837);

__webpack_require__(6699);

__webpack_require__(4747);

__webpack_require__(7042);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(2023);

__webpack_require__(2707);

__webpack_require__(7941);

__webpack_require__(1249);

__webpack_require__(9600);

var Match = __webpack_require__(9458);

var Sequence = __webpack_require__(7793);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

var TileContainer = __webpack_require__(502);

var Wall = __webpack_require__(6212);

var windOrder = ["north", "east", "south", "west"];

function getBackwardsDistance(placerWind, throwerWind) {
  //total is the distance backwards from the placer to the thrower.
  var i = windOrder.indexOf(placerWind);
  var total = 0;

  while (windOrder[i] !== throwerWind) {
    total++;
    i--;

    if (i === -1) {
      i = windOrder.length - 1;
    }
  }

  return total;
}

function getPriority(obj, key) {
  var exemptFromChecks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (obj[key] === "Next") {
    return true;
  }

  var client = globalThis.serverStateManager.getClient(key);
  var throwerWind = this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind;
  var hand = this.gameData.playerHands[key];
  var placerWind = hand.wind;
  var priority;

  if (this.gameData.charleston) {
    if (obj[key].length > 3) {
      client.message("roomActionPlaceTiles", "You can pass no more than 3 tiles during one Charleston round. ", "error");
      return false;
    }

    if (this.gameData.charleston.directions[0][0].allAgree) {
      if (![0, 3].includes(obj[key].length)) {
        client.message("roomActionPlaceTiles", "Pass zero tiles (press proceed on nothing) to veto this round. Pass three tiles to vote in favor. ", "error");
        return false;
      } else if (obj[key].length === 0) {
        this.messageAll([key], "roomActionGameplayAlert", "Charleston Round Vetoed by " + client.getNickname(), "success");
        client.message("roomActionGameplayAlert", "Charleston Round Vetoed", "success"); //Veto the round - don't make other players wait.

        this.clientIds.slice(0, 4).forEach(function (clientId) {
          if (!obj[clientId]) {
            obj[clientId] = [];
          }
        });
        return true;
      }
    } else if (this.gameData.charleston.directions[0][0].blind) {//We probably want to notify the player across how many tiles are being passed,
      //or short circuit them if no tiles are passed.
    } else if (obj[key].length !== 3) {
      client.message("roomActionPlaceTiles", "This Charleston round requires exactly three tiles. ", "error");
      return false;
    }

    if (obj[key].some(function (tile) {
      return tile.type === "joker";
    })) {
      client.message("roomActionPlaceTiles", "Jokers may not be passed during Charleston. ", "error");
      return false;
    }

    if (hand.removeTilesFromHand(obj[key])) {
      //Assume number of tiles is valid for turn.
      return true;
    } else {
      client.message("roomActionPlaceTiles", "You can't pass tiles you don't possess. ", "error");
      return false;
    }
  } else if (obj[key] instanceof TileContainer || this.state.settings.gameStyle === "american" && obj[key].mahjong) {
    //TileContainers are American Mahjong. We don't validate everything here -
    //We will block some illegal moves, but don't validate anything against a card.
    if (this.gameData.currentTurn.thrown.type === "joker") {
      client.message("roomActionPlaceTiles", "You can't pick up a joker! Jokers are dead when thrown! ", "error");
      return false;
    }

    if (!(obj[key] instanceof TileContainer)) {
      //Must be going Mahjong. In American Mahjong, you can pick up a single tile with nothing for Mahjong.
      //If the user empty pressed Mahjong, pick up the specified tile and go Mahjong.
      var temp = new TileContainer({
        tiles: [obj[key]]
      });
      temp.mahjong = obj[key].mahjong;
      obj[key] = temp;
    } else if (!obj[key].mahjong) {
      //Validate that this is 3 or more tiles.
      if (obj[key].tiles.length < 3) {
        client.message("roomActionPlaceTiles", "Except for Mahjong, you can only call for matches of 3+ tiles and/or jokers. ", "error");
        return false;
      } else if (!obj[key].isValidMatch(true)) {
        client.message("roomActionPlaceTiles", "Except for Mahjong, you can only call for matches. ", "error");
        return false;
      }
    }

    if (obj[key].tiles.length === 2 && obj[key].isValidMatch() === false && obj[key].isValidMatch(true)) {
      //The tile object is returned, so === true would not work.
      client.message("roomActionPlaceTiles", "Jokers can't be used to make a pair. ", "error");
      return false;
    }

    priority = 89 - getBackwardsDistance(placerWind, throwerWind);

    if (obj[key].mahjong) {
      priority += 20;
    }
  } else {
    hand.add(this.gameData.currentTurn.thrown); //wouldMakeMahjong will confirm that the current tile will allow mahjong to happen.

    var mahjongHand = hand.isMahjong(this.state.settings.maximumSequences);
    var wouldMakeMahjong = !!mahjongHand;
    hand.remove(this.gameData.currentTurn.thrown);

    if (mahjongHand instanceof Hand && !exemptFromChecks) {
      //Determine if the possible mahjong contains the specified placement, and if not, notify user and drop mahjong priority.
      var stringContents = mahjongHand.getStringContents(); //Exposed vs unexposed can cause issues comparing strings. Need a .matches in future.

      var previousValue = obj[key].exposed;
      obj[key].exposed = false;
      var unexposed = obj[key].toJSON();
      obj[key].exposed = true;
      var exposed = obj[key].toJSON();
      obj[key].exposed = previousValue;

      if (!(stringContents.includes(unexposed) || stringContents.includes(exposed))) {
        wouldMakeMahjong = false;
      }
    }

    var nakedMahjong = false;

    if (obj[key] instanceof Tile && obj[key].mahjong && mahjongHand) {
      //Naked Mahjong. The one tile is the tile someone else discarded.
      console.log("Naked Mahjong Bypassing Checks");
      nakedMahjong = true;
    } else if (obj[key].mahjong && !wouldMakeMahjong && !exemptFromChecks) {
      client.message("roomActionPlaceTiles", "Unable to detect a mahjong in your hand. (Press 'Mahjong' again to override). ", "error");
      return false;
    }

    if ((wouldMakeMahjong || nakedMahjong) && obj[key].mahjong) {
      priority = 109;
      var total = getBackwardsDistance(placerWind, throwerWind);
      console.log(total);
      priority -= total;
    } else if (obj[key] instanceof Match) {
      //Validate that this is not a pair.
      if (obj[key].amount === 2) {
        if (!wouldMakeMahjong && !exemptFromChecks) {
          client.message("roomActionPlaceTiles", "You can't place a pair when it will not make you mahjong. (Press 'Proceed' or 'Mahjong' again to override)", "error");
          return false;
        } else if (exemptFromChecks) {//Allow, and don't force mahjong.
        } else {
          placement.mahjong = true; //The specified action can only be accomplished through mahjong.
        }
      }

      priority = 104 - getBackwardsDistance(placerWind, throwerWind);
    } else if (obj[key] instanceof Sequence) {
      //Verify that the user is the one immediently before.
      if (getBackwardsDistance(placerWind, throwerWind) > 1 && !exemptFromChecks) {
        client.message("roomActionPlaceTiles", "You can only take a sequence from the player before you, except with mahjong. (Press 'Proceed' again to override) ", "error");
        return false;
      }

      priority = 99 - getBackwardsDistance(placerWind, throwerWind);
    } else {
      console.error("Unknown Placement in turnChoicesProxyHandler");
      priority = 89 - getBackwardsDistance(placerWind, throwerWind);
    }
  }

  return [priority, key];
}

function calculateNextTurn(obj, exemptFromChecks) {
  var _this = this;

  //Obj is the turnChoices object.
  if (this.gameData.charleston) {
    var _this$gameData$charle;

    var playerHands = [];
    var placements = [];

    for (var clientId in this.gameData.playerHands) {
      var hand = this.gameData.playerHands[clientId];
      var position = windOrder.indexOf(hand.wind);
      playerHands[position] = hand;
      placements[position] = obj[clientId];
    }

    var currentDirection = this.gameData.charleston.directions[0].shift();

    if (currentDirection.allAgree && !placements.every(function (placement) {
      return placement.length === 3;
    })) {
      //Veto the entire round.
      this.gameData.charleston.directions.shift();
      currentDirection.direction = "none";
    } //If the round is empty, switch rounds.


    if (this.gameData.charleston.directions[0].length === 0) {
      this.gameData.charleston.directions.shift();
    }

    var increment;

    switch (currentDirection.direction) {
      case "right":
        increment = 1;
        break;

      case "across":
        increment = 2;
        break;

      case "left":
        increment = 3;
        break;

      case "none":
        increment = 0;
        break;

      default:
        throw "Unknown Direction" + currentDirection;
    }

    if (increment === 2) {
      //Swap tiles in order specified.
      ;
      [0, 1].forEach(function (position) {
        var placement = placements[position];
        var passerHand = playerHands[position];
        var passToIndex = position + 2;
        var passToHand = playerHands[passToIndex];
        var passToHandPlacement = placements[passToIndex];

        for (var i = 0; i < Math.max(placement.length, passToHandPlacement.length); i++) {
          if (placement[i] && passToHandPlacement[i]) {
            passToHand.add(placement[i]);
            passerHand.add(passToHandPlacement[i]);
          } else if (placement[i]) {
            passerHand.add(placement[i]);
          } else if (passToHandPlacement[i]) {
            passToHand.add(passToHandPlacement[i]);
          }
        }
      });
    } else {
      var tiles = [];
      placements.forEach(function (placement) {
        var _placement$;

        //Pass tiles into cache.
        //Blind pass needs to pick the same tiles every time when state is reloaded -
        //we can't use a form of randomness that is going to change when reloading from state.
        //We will seed with roomId and first tile in placement.
        var rngSeed = _this.roomId + ((_placement$ = placement[0]) === null || _placement$ === void 0 ? void 0 : _placement$.type); //There might not be a first element in placement.

        Wall.shuffleArray(placement, rngSeed); //It's BLIND! Pick random!

        placement.forEach(function (tile) {
          tiles.push(tile);
        });
      }); //Take tiles out of cache - order based on receivers of passes.
      //This should ensure that blind passes are handled properly.

      placements.forEach(function (unused, position) {
        var receiveIndex = (position + increment) % 4;
        var tilesToReceive = placements[receiveIndex].length;
        var receiveHand = playerHands[receiveIndex];

        for (var i = 0; i < tilesToReceive; i++) {
          receiveHand.add(tiles.shift());
        }
      });
    }

    var nextDirection = (_this$gameData$charle = this.gameData.charleston.directions[0]) === null || _this$gameData$charle === void 0 ? void 0 : _this$gameData$charle[0];

    if (nextDirection) {
      this.messageAll([], "roomActionGameplayAlert", "The next Charleston pass is " + nextDirection.direction, "success");

      if (nextDirection.allAgree) {
        this.setAllInstructions([], "Round Vote - Pass 3 tiles " + nextDirection.direction + " for another Charleston round. Pass 0 to block it. Tap tiles to add/remove from placemat. Hit Proceed when ready. ", "success");
      } else if (nextDirection.blind) {
        this.setAllInstructions([], "Optional Charleston Pass - Pass 0-3 tiles " + nextDirection.direction + ". Tap tiles to add/remove from placemat. Hit Proceed when ready. ", "success");
      } else {
        this.setAllInstructions([], "The next Charleston pass is " + nextDirection.direction + ". The tiles passed to you are in the placemat - tap to move tiles between the placemat and your hand. Hit Proceed when ready. ", "success");
      }
    } else {
      this.setInstructions(this.gameData.currentTurn.userTurn, "The Charleston is over. \n\nAs East wind, you get to make the first throw. Select one tile and press Proceed.");
      this.setAllInstructions([this.gameData.currentTurn.userTurn], "The Charleston is over. Waiting on East Wind to make a play. ");
      this.gameData.charleston = false; //The charleston is over.
    }
  } else {
    this.gameData.previousTurnPickedUp = true; //Used for in-hand mahjong detection.
    //Handle this turn, and begin the next one.

    var priorityList = [];

    for (var key in obj) {
      var res = getPriority.call(this, obj, key, exemptFromChecks.includes(key));

      if (res instanceof Array) {
        priorityList.push(res);
      }
    } //If anybody attempted to place, time to process them.


    var utilized = false; //Did we use the thrown tile?

    if (priorityList.length !== 0) {
      //Sort highest to lowest
      priorityList.sort(function (a, b) {
        return b[0] - a[0];
      });

      for (var i = 0; i < priorityList.length; i++) {
        var _clientId = priorityList[i][1];
        var client = globalThis.serverStateManager.getClient(_clientId);

        if (utilized === true) {
          client.message("roomActionPlaceTiles", "Placing tiles failed because another player had a higher priority placement (mahjong>match>sequence, and by order within category).", "error");
          continue;
        }

        var _placement = obj[_clientId];
        var _hand = this.gameData.playerHands[_clientId]; //If placement succeeds, switch userTurn

        console.log(_placement);

        if (_placement instanceof Sequence) {
          //Confirm that the sequence uses the thrown tile.
          var valid = false;

          _placement.tiles.forEach(function (tile) {
            if (tile.value === _this.gameData.currentTurn.thrown.value && tile.type === _this.gameData.currentTurn.thrown.type) {
              valid = true;
            }
          });

          console.log(valid);

          if (valid) {
            //Add the tile to hand, attempt to verify, and, if not, remove
            _hand.add(this.gameData.currentTurn.thrown);

            if (_hand.removeTilesFromHand(_placement)) {
              utilized = true;

              _hand.add(_placement);

              _placement.exposed = true;
              this.messageAll([_clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a sequence of " + _placement.tiles[0].type + "s", {
                clientId: _clientId,
                speech: "Chow"
              });

              if (_placement.mahjong) {
                this.goMahjong(_clientId, undefined, exemptFromChecks.includes(_clientId));
              }

              this.gameData.currentTurn.userTurn = _clientId;
            } else {
              _hand.remove(this.gameData.currentTurn.thrown);

              client.message("roomActionPlaceTiles", "You can't place a sequence of tiles you do not possess - try reloading the page or restarting the app", "error");
            }
          } else {
            client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error");
          }
        } else if (_placement instanceof Match) {
          //Confirm that the match uses the thrown tile
          if (_placement.value === this.gameData.currentTurn.thrown.value && _placement.type === this.gameData.currentTurn.thrown.type) {
            //We can just verify for on less tile here.
            if (_hand.removeMatchingTilesFromHand(_placement.getComponentTile(), _placement.amount - 1)) {
              utilized = true;

              _hand.add(_placement);

              _placement.exposed = true;
              var matchType = [,, "pair", "pong", "kong"][_placement.amount];
              this.messageAll([_clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a " + matchType + " of " + _placement.getTileName(this.state.settings.gameStyle) + "s", {
                clientId: _clientId,
                speech: matchType
              });

              if (_placement.mahjong) {
                this.goMahjong(_clientId, undefined, exemptFromChecks.includes(_clientId));
              }

              if (_placement.amount === 4) {
                //Draw them another tile.
                this.drawTile(_clientId);
              }

              this.gameData.currentTurn.userTurn = _clientId;
            } else {
              console.log("Attempted to place invalid match");
              client.message("roomActionPlaceTiles", "You can't place a match of tiles you do not possess - try reloading the page or restarting the app", "error");
            }
          } else {
            client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error");
          }
        } else if (_placement instanceof TileContainer) {
          //Confirm that the TileContainer uses the thrown tile.
          var _valid = false;

          _placement.tiles.forEach(function (tile) {
            if (tile.value === _this.gameData.currentTurn.thrown.value && tile.type === _this.gameData.currentTurn.thrown.type) {
              _valid = true;
            }
          });

          if (_valid) {
            //Add the tile to hand, attempt to verify, and, if not, remove
            _hand.add(this.gameData.currentTurn.thrown);

            if (_hand.removeTilesFromHand(_placement)) {
              utilized = true;

              _hand.add(_placement);

              var matchInfo = "match";

              var matchTile = _placement.isValidMatch(true);

              if (matchTile) {
                matchInfo = [,, "pair", "pong", "kong", "quint", "sextet"][_placement.tiles.length];
                matchInfo += " of " + matchTile.getTileName(this.state.settings.gameStyle) + "s";
              }

              this.messageAll([_clientId], "roomActionGameplayAlert", client.getNickname() + " has placed a " + matchInfo, {
                clientId: _clientId,
                speech: "I'll take that"
              });

              if (_placement.mahjong) {
                this.goMahjong(_clientId, undefined, exemptFromChecks.includes(_clientId));
              }

              this.gameData.currentTurn.userTurn = _clientId;
            } else {
              _hand.remove(this.gameData.currentTurn.thrown);

              client.message("roomActionPlaceTiles", "You can't place tiles you do not possess - try reloading the page or restarting the app", "error");
            }
          } else {
            client.message("roomActionPlaceTiles", "Are you trying to hack? You must use the thrown tile when attempting to place off turn. ", "error");
          }
        } else if (_placement.mahjong) {
          //Attempt a naked mahjong - user didn't provide what to do.
          //TODO: BUG! Naked Mahjong may result in some placements being considered in-hand when they are not!
          //This should be fixed, or scores might be slightly off.
          console.log("Attempting Naked Mahjong");

          _hand.add(this.gameData.currentTurn.thrown);

          this.goMahjong(_clientId, undefined, exemptFromChecks.includes(_clientId));

          try {
            _hand.remove(this.gameData.currentTurn.thrown);
          } catch (e) {
            console.log("Unable to remove. Appears Naked Mahjong Successful");
          }
        } else {
          console.error("No known operation to perform when processing turn. ");
        }
      }
    }

    if (utilized === false) {
      this.gameData.previousTurnPickedUp = false; //Shift to next player, draw them a tile.

      var nextWind = windOrder[(windOrder.indexOf(this.gameData.playerHands[this.gameData.currentTurn.userTurn].wind) + 1) % 4];

      for (var _clientId2 in this.gameData.playerHands) {
        var _hand2 = this.gameData.playerHands[_clientId2];

        if (_hand2.wind === nextWind) {
          //Pick up as 4th tile for an exposed pong if possible.
          //TODO: Consider notifying people when the 4th tile is added. We currently don't do this, because it is just points, so shouldn't really impact
          //gameplay, and the message can't currently be sent to the person who gained the pickup, as they receive tile pickup message too.
          _hand2.contents.forEach(function (item) {
            if (item instanceof Match && item.type === _this.gameData.currentTurn.thrown.type && item.value === _this.gameData.currentTurn.thrown.value) {
              utilized = true;
              item.amount = 4;
            }
          }); //Switch the turn, and draw the next tile.


          if (utilized === false) {
            this.gameData.discardPile.push(this.gameData.currentTurn.thrown);
            this.drawTile(_clientId2);
          } else {
            this.drawTile(_clientId2);
          }

          this.gameData.currentTurn.userTurn = _clientId2;
        }
      }
    }

    if (!(this.gameData.isMahjong || this.gameData.wall.isEmpty)) {
      var currentTurnClient = globalThis.serverStateManager.getClient(this.gameData.currentTurn.userTurn);
      this.setAllInstructions([currentTurnClient.clientId], "Waiting on ".concat(currentTurnClient.getNickname(), " to make a move. \n\nIs someone's game frozen? Clicking the sync icon (below this message) might fix that! "));
    }

    this.gameData.currentTurn.thrown = false;
  } //Clear the object.


  for (var _key in obj) {
    delete obj[_key];
  }

  this.sendStateToClients();
}

var exemptFromChecks = [];

module.exports = function (obj, prop, value) {
  obj[prop] = value; //Remove invalid assignments. getPriority will issue error messages to clients as needed.

  if (getPriority.call(this, obj, prop, exemptFromChecks.includes(prop)) === false) {
    delete obj[prop];

    if (globalThis.serverStateManager.getClient(prop).isBot) {
      console.log("Bots are not allowed to obtain override power. ");
    } else {
      exemptFromChecks.push(prop); //We will only block a client once per turn. Successive attempts will be treated as overrides.
    }
  } //The user can never pick up their own discard tile, hence is always "Next", except during charleston


  if (!this.gameData.charleston) {
    obj[this.gameData.currentTurn.userTurn] = "Next";
  }

  if (Object.keys(obj).length === 4) {
    calculateNextTurn.call(this, obj, exemptFromChecks);
    exemptFromChecks = [];
  } else {
    //Calculate who hasn't entered an action.
    var message = "Waiting on: ";
    var guiltyParties = [];
    this.clientIds.slice(0, 4).forEach(function (clientId) {
      if (!obj[clientId]) {
        guiltyParties.push(clientId);
      }
    });
    var guiltyPartyNames = guiltyParties.map(function (clientId) {
      return globalThis.serverStateManager.getClient(clientId).getNickname();
    });
    message += guiltyPartyNames.join(", ");
    message += "\n\nIs someone's game frozen? Clicking the sync icon (below this message) might fix that! ";
    this.setAllInstructions(guiltyParties, message); //Message everybody that has entered a turn - don't overwrite other instructions.
  }

  return true;
};

/***/ }),

/***/ 3093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(3210);

__webpack_require__(5837);

__webpack_require__(5735);

__webpack_require__(3753);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Room = __webpack_require__(8258);

var Client = __webpack_require__(927);

var Bot = __webpack_require__(463); //For state saving.


var fs, path;

try {
  fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {
  console.warn(e);
}

var StateManager = /*#__PURE__*/function () {
  "use strict";

  function StateManager() {
    var rooms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var clients = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, StateManager);

    //We'll trim all leading and trailing spaces for roomIds.
    rooms = new Proxy(rooms, {
      get: function get(obj, prop) {
        //Since values are trimmed when added, this is unless we loaded from a saved state.
        var value = obj[prop];

        if (value instanceof String) {
          return value.trim();
        }

        return value;
      },
      set: function set(obj, prop, value) {
        if (value instanceof String) {
          value = value.trim();
        }

        obj[prop] = value;
        return true;
      }
    });

    this.getRoom = function (roomId) {
      return rooms[roomId];
    };

    this.createRoom = function (roomId, room) {
      if (rooms[roomId]) {
        return false;
      } //Room already exists.


      return rooms[roomId] = room || new Room(roomId);
    };

    this.deleteRoom = function (roomId) {
      delete rooms[roomId];
    };

    this.getClient = function (clientId) {
      return clients[clientId];
    };

    this.createClient = function (clientId, websocket) {
      clients[clientId] = new Client(clientId, websocket);
      return clients[clientId];
    };

    this.createBot = function () {
      var clientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StateManager.findUniqueId(clients, "bot");
      var websocket = arguments.length > 1 ? arguments[1] : undefined;
      //Websocket intended for dev use.
      clients[clientId] = new Bot(clientId, websocket);
      return clients[clientId];
    };

    this.deleteClient = function (clientId) {
      delete clients[clientId];
    };

    this.getAllClients = function () {
      var arr = [];

      for (var clientId in clients) {
        arr.push(clients[clientId]);
      }

      return arr;
    };

    this.init = function fromJSON(str) {
      //Load clients and rooms from a saved state.
      console.time("Initializing server state... ");
      var obj = JSON.parse(str);
      var loadClients = obj.clients;
      var loadRooms = obj.rooms;

      for (var clientId in loadClients) {
        clients[clientId] = Client.fromJSON(loadClients[clientId]);
      }

      for (var roomId in loadRooms) {
        rooms[roomId] = Room.fromJSON(loadRooms[roomId]);
        rooms[roomId].init();
        console.log(globalThis.serverStateManager.getRoom(roomId));
      }

      console.timeEnd("Initializing server state... ");
    }.bind(this);

    this.toJSON = function () {
      //Convert our state to a string.
      //Since both room and client objects have a toString method, we can do this quite easily with JSON.stringify
      return JSON.stringify({
        rooms: rooms,
        clients: clients
      });
    }.bind(this);
  }

  _createClass(StateManager, null, [{
    key: "findUniqueId",
    value: function findUniqueId(obj) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var idLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Math.pow(2, 9);
      var random, id; //We will use short ids until we have trouble generating ids.

      while (!id || obj[prefix + random]) {
        random = Math.floor(Math.random() * idLimit);
        id = prefix + random;
        idLimit = Math.min(Math.pow(2, 53), idLimit * 2);
      }

      return id;
    }
  }]);

  return StateManager;
}();

module.exports = StateManager;

/***/ }),

/***/ 3205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2222);

var utilities = __webpack_require__(2976);

var output = [];
output = output.concat(__webpack_require__(6533));
output = output.concat(__webpack_require__(2289));
output = output.concat(__webpack_require__(805));
output = output.concat(__webpack_require__(4554));
output = output.concat(__webpack_require__(7541));
output = output.concat(__webpack_require__(8942));
output = output.concat(__webpack_require__(7255));
output = output.concat(__webpack_require__(5014));
output = output.concat(__webpack_require__(6));
output = utilities.outputExpander(output);
console.log(output);
module.exports = {
  combos: output,
  name: "2020 National Mahjongg League"
};

/***/ }),

/***/ 7255:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 5,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 4
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 1,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 5,
      amount: 1
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 5,
      amount: 1
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 4
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 7,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 7,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [1, 5].forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suit],
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset + 2,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset + 4,
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 35,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "13579";
  return output;
});

/***/ }),

/***/ 8942:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 2,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "green",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "red",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 5
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 2,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "2020";
  return output;
});

/***/ }),

/***/ 7541:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[2]],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 4,
      amount: 1
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 4,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 8,
      amount: 1
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 4,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suit],
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 8,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "2468";
  return output;
});

/***/ }),

/***/ 5014:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [3, 6, 9].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 3,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 6,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 9,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suit],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 4
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 35,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "369";
  return output;
});

/***/ }),

/***/ 4554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    allSuits.forEach(function (suit) {
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[0]],
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[1]],
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 5
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Any Like Numbers";
  return output;
});

/***/ }),

/***/ 2289:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    [0, 4].forEach(function (offset) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 5 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 4
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 4
      }));
    }); //Part two of option

    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 4
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suit],
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -4).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 4 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 4
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[1]],
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[2]],
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Consecutive Run";
  return output;
});

/***/ }),

/***/ 805:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    allOptions.forEach(function (offset) {
      dragonOptions.forEach(function (dragon) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: "dragon",
          value: dragon,
          amount: 4
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset,
          amount: 5
        }));
        newArr.push(createTiles({
          type: "flower",
          value: "4",
          amount: 5
        })); //Value is no-op here.
      });
    });
  });
  return {
    tiles: tiles,
    score: 40,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [1, 5].forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Quints";
  return output;
});

/***/ }),

/***/ 6:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "wind",
        value: "north",
        amount: 2
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "east",
        amount: 2
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "west",
        amount: 2
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "south",
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -4).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suit],
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -1).forEach(function (offset) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: allSuits[0],
      value: offset,
      amount: 2
    }));
    newArr.push(createTiles({
      type: allSuits[0],
      value: 1 + offset,
      amount: 2
    }));
    newArr.push(createTiles({
      type: allSuits[1],
      value: offset,
      amount: 2
    }));
    newArr.push(createTiles({
      type: allSuits[1],
      value: 1 + offset,
      amount: 2
    }));
    newArr.push(createTiles({
      type: allSuits[2],
      value: offset,
      amount: 2
    }));
    newArr.push(createTiles({
      type: allSuits[2],
      value: 1 + offset,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 8,
      amount: 1
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[0]],
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 4,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 1
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[1]],
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 7,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 9,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 85,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Singles and Pairs";
  return output;
});

/***/ }),

/***/ 6533:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  dragonArrangments.forEach(function (values) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: values[0],
      amount: 4
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: values[1],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  oddOptions.forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
    allSuits.forEach(function (suit) {
      newArr.push(createTiles({
        type: suit,
        value: num,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  evenOptions.forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 4
    }));
    allSuits.forEach(function (suit) {
      newArr.push(createTiles({
        type: suit,
        value: num,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  dragonOptions.forEach(function (dragon) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: dragon,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
  }); //Part two of option.

  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Winds and Dragons";
  return output;
});

/***/ }),

/***/ 7338:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2222);

var utilities = __webpack_require__(2976); //Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.


var output = [];
output = output.concat(__webpack_require__(6224));
output = output.concat(__webpack_require__(2550));
output = output.concat(__webpack_require__(3058));
output = output.concat(__webpack_require__(5076));
output = output.concat(__webpack_require__(7998));
output = output.concat(__webpack_require__(8174));
output = output.concat(__webpack_require__(4827));
output = output.concat(__webpack_require__(3148));
output = output.concat(__webpack_require__(7111));
output = utilities.outputExpander(output);
console.log(output);
module.exports = {
  combos: output,
  name: "2021 National Mahjongg League"
};

/***/ }),

/***/ 3058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 5,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 2
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1, 5].forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suit],
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1, 5].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 4 + offset,
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1, 5].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 4 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[2]],
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1, 5].forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 4
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: 0 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 4 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 6 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 8 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  ;
  [1, 5].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 4 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "13579";
  return output;
});

/***/ }),

/***/ 8174:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 1,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 1,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 1
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 1
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "2021";
  return output;
});

/***/ }),

/***/ 7998:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suit],
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 4,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 8,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 4,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 8,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 8,
      amount: 1
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[1]],
      amount: 4
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[2]],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    evenOptions.forEach(function (offset) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 4,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 6,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 8,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset,
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "2468";
  return output;
});

/***/ }),

/***/ 3148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suit],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 5
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[2]],
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 4
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 4
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "369";
  return output;
});

/***/ }),

/***/ 5076:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "north",
        amount: 1
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "east",
        amount: 1
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "west",
        amount: 1
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "south",
        amount: 1
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 4
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[0]],
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[1]],
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Any Like Numbers";
  return output;
});

/***/ }),

/***/ 2550:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    [0, 4].forEach(function (offset) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 5 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suit],
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 5
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    //Part two of option
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 4
      }));
    }); //Part 1

    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 3 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -1).forEach(function (offset) {
    //Part two of option
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[1]],
        amount: 3
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: suitDragonConversion[suitOrder[2]],
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Consecutive Run";
  return output;
});

/***/ }),

/***/ 6224:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    allOptions.forEach(function (offset) {
      windOptions.forEach(function (wind) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: "wind",
          value: wind,
          amount: 5
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset,
          amount: 4
        }));
        newArr.push(createTiles({
          type: "flower",
          value: "4",
          amount: 5
        })); //Value is no-op here.
      });
    });
  });
  return {
    tiles: tiles,
    score: 40,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 3 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -2).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 5
      }));
    });
  }); //Part 2

  allOptions.slice(0, -2).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -1).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1 + offset,
        amount: 5
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 5
      }));
    });
  });
  return {
    tiles: tiles,
    score: 45,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Quints";
  return output;
});

/***/ }),

/***/ 7111:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.forEach(function (offset) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 2
    }));
    allSuits.forEach(function (suit) {
      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    [0, 4].forEach(function (offset) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset + 1,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset + 3,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset + 1,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset + 3,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset + 5,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset + 1,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset + 3,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset + 5,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -5).forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suit,
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 5 + offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    evenOptions.forEach(function (offset) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        value: "4",
        amount: 2
      })); //Value is no-op here.

      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 4,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 6,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 8,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset,
        amount: 2
      }));
    });
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 6,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 50,
    concealed: true
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    allSuits.forEach(function (suit) {
      newArr.push(createTiles({
        type: suit,
        value: 2,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1,
        amount: 1
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: "white",
        amount: 1
      }));
    });
  });
  return {
    tiles: tiles,
    score: 75,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Singles and Pairs";
  return output;
});

/***/ }),

/***/ 4827:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    windOptions = _require.windOptions,
    suitDragonConversion = _require.suitDragonConversion; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    oddOptions.forEach(function (num) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "wind",
        value: "north",
        amount: 3
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "south",
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: num,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: num,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: num,
        amount: 4
      }));
    }); //Part 2

    evenOptions.forEach(function (num) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "wind",
        value: "east",
        amount: 3
      }));
      newArr.push(createTiles({
        type: "wind",
        value: "west",
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: num,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: num,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: num,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 4
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 2
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "red",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0].forEach(function (num) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "dragon",
      value: "green",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 4
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 1
    }));
  }); //Part 2

  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      value: "4",
      amount: 2
    })); //Value is no-op here.

    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 4
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: "white",
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 2,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 1
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "wind",
      value: "north",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "east",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "west",
      amount: 1
    }));
    newArr.push(createTiles({
      type: "wind",
      value: "south",
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[0]],
      amount: 3
    }));
    newArr.push(createTiles({
      type: "dragon",
      value: suitDragonConversion[suitOrder[1]],
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: true
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Winds and Dragons";
  return output;
});

/***/ }),

/***/ 6587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(7941);

var cards = {
  "2020 National Mahjongg League": __webpack_require__(3205),
  "2021 National Mahjongg League": __webpack_require__(7338)
};
var cardNames = Object.keys(cards);
cards["2021 Marvelous Mahjongg"] = __webpack_require__(418);

function getRandomCard() {
  return cards[cardNames[Math.floor(Math.random() * cardNames.length)]];
}

Object.defineProperty(cards, 'Other Card - Bots Use Random Card', {
  get: getRandomCard
});
module.exports = cards;

/***/ }),

/***/ 418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(1038);

__webpack_require__(7042);

__webpack_require__(8309);

var _output, _output2, _output3, _output4;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var utilities = __webpack_require__(2976); //Order doesn't really matter (might influence sorting output if ratings end up the same, but that should be really minor),
//however putting cards under development last makes them much easier to review for accuracy, as they are at the end of the array.


var output = []; //TODO: We are probably going to want a setup for any pong/any kong (utilities.js getTileDifferential changes?)
//That would massively reduce the number of combos.
//We also need something to handle any tile - probably allow hands under 14 tiles, as the other tiles should fall under any tile.

(_output = output).push.apply(_output, _toConsumableArray(__webpack_require__(7487)));

(_output2 = output).push.apply(_output2, _toConsumableArray(__webpack_require__(8091)));

(_output3 = output).push.apply(_output3, _toConsumableArray(__webpack_require__(6817)));

(_output4 = output).push.apply(_output4, _toConsumableArray(__webpack_require__(8591)));

output = utilities.outputExpander(output);
console.log(output);
module.exports = {
  combos: output,
  name: "2021 Marvelous Mahjongg"
};

/***/ }),

/***/ 6817:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    nonJokerTiles = _require.nonJokerTiles,
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    windOptions = _require.windOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion,
    outputExpander = _require.outputExpander,
    getTileDifferential = _require.getTileDifferential; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, #2, #3 of 5


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 3,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    nonJokerTiles.forEach(function (kongTile) {
      nonJokerTiles.forEach(function (pongTile) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: suit,
          value: 3,
          amount: 3
        }));
        newArr.push(createTiles({
          type: suit,
          value: 6,
          amount: 3
        }));
        newArr.push(createTiles({
          type: suit,
          value: 9,
          amount: 1
        }));
        newArr.push(createTiles({
          type: kongTile.type,
          value: kongTile.value,
          amount: 4
        }));
        newArr.push(createTiles({
          type: pongTile.type,
          value: pongTile.value,
          amount: 3
        }));
      });
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false,
    skipDuplicateRemoval: true //Too many combos.

  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 9,
      amount: 2
    }));
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "3 More Miles";
  return output;
});

/***/ }),

/***/ 7487:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    nonJokerTiles = _require.nonJokerTiles,
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    windOptions = _require.windOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion,
    outputExpander = _require.outputExpander,
    getTileDifferential = _require.getTileDifferential; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2 of 7


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [2, 4].forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      nonJokerTiles.forEach(function (kongTile) {
        nonJokerTiles.forEach(function (pongTile) {
          var newArr = [];
          tiles.push(newArr);
          newArr.push(createTiles({
            type: "flower",
            amount: 1
          }));
          newArr.push(createTiles({
            type: suitOrder[0],
            value: 0 + offset,
            amount: 1
          }));
          newArr.push(createTiles({
            type: suitOrder[1],
            value: 2 + offset,
            amount: 2
          }));
          newArr.push(createTiles({
            type: suitOrder[2],
            value: 4 + offset,
            amount: 3
          }));
          newArr.push(createTiles({
            type: kongTile.type,
            value: kongTile.value,
            amount: 4
          }));
          newArr.push(createTiles({
            type: pongTile.type,
            value: pongTile.value,
            amount: 3
          }));
        });
      });
    });
    allSuits.forEach(function (suit) {
      nonJokerTiles.forEach(function (kongTile) {
        nonJokerTiles.forEach(function (pongTile) {
          var newArr = [];
          tiles.push(newArr);
          newArr.push(createTiles({
            type: "flower",
            amount: 1
          }));
          newArr.push(createTiles({
            type: suit,
            value: 0 + offset,
            amount: 1
          }));
          newArr.push(createTiles({
            type: suit,
            value: 2 + offset,
            amount: 2
          }));
          newArr.push(createTiles({
            type: suit,
            value: 4 + offset,
            amount: 3
          }));
          newArr.push(createTiles({
            type: kongTile.type,
            value: kongTile.value,
            amount: 4
          }));
          newArr.push(createTiles({
            type: pongTile.type,
            value: pongTile.value,
            amount: 3
          }));
        });
      });
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false,
    skipDuplicateRemoval: true //Too many combos.

  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 2,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 4,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 6,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 8,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 6,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[2],
      value: 8,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Double Harness";
  return output;
});

/***/ }),

/***/ 8091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

var _require = __webpack_require__(2976),
    nonJokerTiles = _require.nonJokerTiles,
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    windOptions = _require.windOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion,
    outputExpander = _require.outputExpander,
    getTileDifferential = _require.getTileDifferential; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2, 3, 4 of 7


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuitArrangements.forEach(function (suitOrder) {
    nonJokerTiles.forEach(function (kongTile) {
      nonJokerTiles.forEach(function (pongTile) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: suitOrder[0],
          value: 1,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suitOrder[1],
          value: 3,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suitOrder[1],
          value: 5,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suitOrder[1],
          value: 7,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suitOrder[2],
          value: 9,
          amount: 3
        }));
        newArr.push(createTiles({
          type: kongTile.type,
          value: kongTile.value,
          amount: 4
        }));
        newArr.push(createTiles({
          type: pongTile.type,
          value: pongTile.value,
          amount: 3
        }));
      });
    });
  });
  allSuits.forEach(function (suit) {
    nonJokerTiles.forEach(function (kongTile) {
      nonJokerTiles.forEach(function (pongTile) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: suit,
          value: 1,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: 3,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: 5,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: 7,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: 9,
          amount: 3
        }));
        newArr.push(createTiles({
          type: kongTile.type,
          value: kongTile.value,
          amount: 4
        }));
        newArr.push(createTiles({
          type: pongTile.type,
          value: pongTile.value,
          amount: 3
        }));
      });
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false,
    skipDuplicateRemoval: true //Too many combos.

  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 1,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suit,
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 5,
      amount: 2
    }));
    newArr.push(createTiles({
      type: suit,
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suit,
      value: 9,
      amount: 3
    }));
  }); //Part 2

  allSuitArrangements.forEach(function (suitOrder) {
    var newArr = [];
    tiles.push(newArr);
    newArr.push(createTiles({
      type: "flower",
      amount: 2
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 1,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 3,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[0],
      value: 5,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 5,
      amount: 1
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 7,
      amount: 3
    }));
    newArr.push(createTiles({
      type: suitOrder[1],
      value: 9,
      amount: 3
    }));
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  [0, 2, 4].forEach(function (offset) {
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: offset + 1,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset + 3,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: offset + 5,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 5,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 7,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suit,
        value: 9,
        amount: 1
      }));
    }); //Part 2

    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: offset + 1,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: offset + 3,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: offset + 5,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 3,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 5,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 7,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 9,
        amount: 1
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  dragonOptions.forEach(function (dragon) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: "flower",
        amount: 4
      }));
      newArr.push(createTiles({
        type: "dragon",
        value: dragon,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 2,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 1,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 5,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 7,
        amount: 1
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 9,
        amount: 1
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Oddly Matched";
  return output;
});

/***/ }),

/***/ 8591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(1249);

__webpack_require__(4747);

__webpack_require__(7042);

var _require = __webpack_require__(2976),
    nonJokerTiles = _require.nonJokerTiles,
    createTiles = _require.createTiles,
    allSuits = _require.allSuits,
    allSuitArrangements = _require.allSuitArrangements,
    oddOptions = _require.oddOptions,
    evenOptions = _require.evenOptions,
    allOptions = _require.allOptions,
    windOptions = _require.windOptions,
    dragonOptions = _require.dragonOptions,
    dragonArrangments = _require.dragonArrangments,
    suitDragonConversion = _require.suitDragonConversion,
    outputExpander = _require.outputExpander,
    getTileDifferential = _require.getTileDifferential; //Each function will return an array. Each array will contain every possible matching combo in the form of an array of tiles.
//Hands #1, 2, 3 of 7


module.exports = [function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allSuits.forEach(function (suit) {
    nonJokerTiles.forEach(function (kongTile) {
      allOptions.slice(0, -4).forEach(function (offset) {
        var newArr = [];
        tiles.push(newArr);
        newArr.push(createTiles({
          type: suit,
          value: offset + 0,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset + 1,
          amount: 3
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset + 2,
          amount: 1
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset + 3,
          amount: 4
        }));
        newArr.push(createTiles({
          type: suit,
          value: offset + 4,
          amount: 1
        }));
        newArr.push(createTiles({
          type: kongTile.type,
          value: kongTile.value,
          amount: 4
        }));
      });
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false,
    skipDuplicateRemoval: true //Lots of combos

  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -3).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 3 + offset,
        amount: 4
      }));
    });
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: 0 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 4
      }));
    });
  });
  return {
    tiles: tiles,
    score: 25,
    concealed: false
  };
}, function () {
  var tiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  allOptions.slice(0, -4).forEach(function (offset) {
    allSuitArrangements.forEach(function (suitOrder) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[2],
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suitOrder[1],
        value: 3 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suitOrder[0],
        value: 4 + offset,
        amount: 3
      }));
    });
    allSuits.forEach(function (suit) {
      var newArr = [];
      tiles.push(newArr);
      newArr.push(createTiles({
        type: suit,
        value: 0 + offset,
        amount: 3
      }));
      newArr.push(createTiles({
        type: suit,
        value: 1 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 2 + offset,
        amount: 4
      }));
      newArr.push(createTiles({
        type: suit,
        value: 3 + offset,
        amount: 2
      }));
      newArr.push(createTiles({
        type: suit,
        value: 4 + offset,
        amount: 3
      }));
    });
  });
  return {
    tiles: tiles,
    score: 30,
    concealed: false
  };
}].map(function (func, index) {
  var output = func();
  output.cardIndex = index;
  output.section = "Running With The Bulls";
  return output;
});

/***/ }),

/***/ 2976:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

__webpack_require__(6535);

__webpack_require__(9244);

__webpack_require__(1249);

__webpack_require__(7327);

__webpack_require__(2222);

__webpack_require__(3290);

__webpack_require__(2707);

__webpack_require__(4747);

__webpack_require__(4553);

__webpack_require__(561);

__webpack_require__(9601);

__webpack_require__(4944);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(1038);

__webpack_require__(7042);

__webpack_require__(8309);

var Tile = __webpack_require__(2946);

var TileContainer = __webpack_require__(502);

var Wall = __webpack_require__(6212); //https://stackoverflow.com/a/30551462/10965456


function permutations(xs) {
  if (!xs.length) return [[]];
  return xs.flatMap(function (x, i) {
    return permutations(xs.filter(function (v, j) {
      return i !== j;
    })).map(function (vs) {
      return [x].concat(_toConsumableArray(vs));
    });
  });
}

function createTiles(_ref) {
  var type = _ref.type,
      value = _ref.value,
      amount = _ref.amount;
  //Temporarily tileName for debugging with console.log
  var tile = new Tile({
    type: type,
    value: value
  });
  return new Array(amount).fill(tile); //Not seperate objects, but should be OK.
}

var allSuits = ["bamboo", "character", "circle"];
var allSuitArrangements = permutations(allSuits);
var oddOptions = [1, 3, 5, 7, 9];
var evenOptions = [2, 4, 6, 8];
var allOptions = oddOptions.concat(evenOptions).sort();
var windOptions = ["north", "east", "west", "south"]; //Dragons are associated with a suit.

var dragonOptions = ["red", "green", "white"];
var dragonArrangments = permutations(dragonOptions);
var suitDragonConversion = {
  "character": "red",
  "bamboo": "green",
  "circle": "white"
};

function getTileDifferential(handOptions, hand) {
  //getTileDifferential takes an array of tiles are determines how many tiles away hand is
  //from every achivable handOption (TODO: Allow passing remaining wall tiles / already exposed tiles)
  if (handOptions.combos) {
    //A card was passed, instead of an array.
    handOptions = handOptions.combos;
  }

  var results = [];

  var _loop = function _loop(i) {
    var handOption = handOptions[i];
    var canFillJoker = [];
    var noFillJoker = [];
    handOption.tiles.forEach(function (item) {
      if (item.length <= 2) {
        noFillJoker.push.apply(noFillJoker, _toConsumableArray(item));
      } else {
        canFillJoker.push.apply(canFillJoker, _toConsumableArray(item));
      }
    });
    var jokerCount = 0;
    var diff = void 0;
    var exposedMatches = 0; //May not be used anymore - was supposed to be used to detect where concealed hands were an issue.

    var notUsed = []; //Used to return which tiles should be thrown for this hand. TODO: This slows things down quite a bit.
    //We need TileContainers and Arrays to be processed first, as those can't be discarded.

    function removeItem(item) {
      if (item.type === "joker") {
        ++jokerCount;
        return true;
      } //TODO: The splice and search should be able to be optimized.


      var noFillIndex = noFillJoker.findIndex(function (tile) {
        return tile.matches(item);
      });

      if (noFillIndex !== -1) {
        noFillJoker.splice(noFillIndex, 1);
        return true;
      }

      var canFillIndex = canFillJoker.findIndex(function (tile) {
        return tile.matches(item);
      });

      if (canFillIndex !== -1) {
        canFillJoker.splice(canFillIndex, 1);
        return true;
      }

      return false;
    }

    var _loop3 = function _loop3(_i2) {
      var handItem = hand[_i2];

      if (handItem instanceof TileContainer) {
        handItem = handItem.tiles;
      }

      if (handItem instanceof Array) {
        if (handOption.concealed === true) {
          //Tiles are exposed! Label this! We'll check later to verify too much isn't exposed.
          exposedMatches++;
        } //Like in the 2021 card, with 2021 #3, it is possible for the same tile to be used in multiple different
        //matches - therefore, we must verify that such a match exists in the target hand.
        //TODO: 2021 #3 still has issues - we remove the kong from noFillJoker instead of canFillJoker,
        //and we also would take a kong when possible, yet a kong makes the hand dead (need 1+ jokers in kong)


        var itemValue = TileContainer.isValidMatch(handItem, true); //True to allow jokers when matching.

        if (handOption.tiles.some(function (item) {
          if (!itemValue) {
            return true;
          } //This exposure must be a bunch of individual tiles, like a 2019.
          else if (item.length === handItem.length && itemValue.matches(TileContainer.findNonJoker(item))) {
              return true;
            } else {
              return false;
            }
        })) {
          //It exists! Now remove the tiles.
          for (var _i4 = 0; _i4 < handItem.length; _i4++) {
            var tile = handItem[_i4];

            if (tile.type === "joker") {
              //The jokers in this match are acting as something. (It must be a pong, kong, etc, to have jokers)
              tile = itemValue;
            }

            if (!removeItem(tile)) {
              diff = Infinity; //The hand is impossible with current exposures.

              return "break|processHandItems";
            }
          }
        } else {
          diff = Infinity;
          return "break|processHandItems";
        }
      }
    };

    processHandItems: for (var _i2 = 0; _i2 < hand.length; _i2++) {
      var _ret = _loop3(_i2);

      if (_ret === "break|processHandItems") break processHandItems;
    }

    if (diff !== Infinity) {
      for (var _i3 = 0; _i3 < hand.length; _i3++) {
        var handItem = hand[_i3];

        if (handItem instanceof TileContainer || handItem instanceof Array) {} else {
          if (!removeItem(handItem)) {
            notUsed.push(handItem); //TODO: If we have a joker acting as this item, put it at the beginning.
          }
        }
      }

      diff = noFillJoker.length + Math.max(0, canFillJoker.length - jokerCount); //This check was preventing the removal of duplicates.

      /*if (handOption.concealed && !(exposedMatches === 0 || (exposedMatches === 1 && diff === 0))) {
      	diff = Infinity
      	console.warn("Hand Requires Concealed, Combo Disabled")
      	continue;
      }*/
      //Add jokers that we aren't using to fill anything
      //We could take a different approach - add jokers until we can't use them -
      //however this approach, while making recovery plans worse,
      //increases the odds of no joker point doubles.

      if (jokerCount > canFillJoker.length) {
        notUsed.push(new Tile({
          type: "joker",
          value: ""
        }));
        jokerCount--;
      }

      results.push({
        diff: diff,
        handOption: handOption,
        noFillJoker: noFillJoker,
        canFillJoker: canFillJoker,
        notUsed: notUsed,
        jokerCount: jokerCount
      });
    }
  };

  for (var i = 0; i < handOptions.length; i++) {
    _loop(i);
  }

  results = results.sort(function (a, b) {
    //Some hands can be Mahjong in multiple different ways, with differing point values (Example: 2020 card, Quints #3, 13579 #1).
    //Therefore, we should sort, in case one hand is more valuable.
    //TODO: These penalties should be lower earlier in charleston.
    //Apply some weighting to reduce the overuse of concealed and jokerless hands.
    var uncallablePenalty = 0.15; //Point penalty per unfilled spot that can't be called for.

    var noJokerPenalty = 0.15; //Point penalty per unfilled spot that requires a non-joker.
    //TODO: We need small penalties against quints, which require jokers.

    var diffA = a.diff;
    var diffB = b.diff; //Give a benefit for hands where we can call for tiles.
    //TODO: Penalize singular remaining tiles less than pairs.
    //TODO: Penalize for callable, but not now, vs never callale.

    function getUncallableTiles(hand) {
      //This function is called so much it is insanely expensive. Cache per hand.
      //Can call for the last tile, so minus 1
      if (hand.handOption.concealed) {
        return Math.max(0, hand.diff - 1); //Diff excludes joker-replacable tiles.
      } else if (hand.uncallableTiles === undefined) {
        var _calculateUncallableTiles = function _calculateUncallableTiles(tiles) {
          var sum = 0;

          var _loop2 = function _loop2(_i) {
            var tile = tiles[_i];

            if (uncallableMatches.some(function (match) {
              return tile.matches(match[0]);
            })) {
              sum++;
            }
          };

          for (var _i = 0; _i < tiles.length; _i++) {
            _loop2(_i);
          }

          return sum;
        }; //We won't penalize for joker replaced tiles - those are, in effect, already in hand.


        var uncallableMatches = hand.handOption.tiles.filter(function (item) {
          return item.length < 3;
        });
        var uncallableTiles = _calculateUncallableTiles(hand.noFillJoker) + Math.max(0, _calculateUncallableTiles(hand.canFillJoker) - hand.jokerCount);
        hand.uncallableTiles = Math.max(0, uncallableTiles - 1);
      }

      return hand.uncallableTiles;
    }

    diffA += getUncallableTiles(a) * uncallablePenalty;
    diffB += getUncallableTiles(b) * uncallablePenalty; //Give a penalty to the hands that need non-joker tiles.

    diffA += a.noFillJoker.length * noJokerPenalty;
    diffB += b.noFillJoker.length * noJokerPenalty; //For Debugging and Analysis.

    a.weightedDiff = diffA;
    b.weightedDiff = diffB;

    if (diffA !== diffB) {
      return diffA - diffB;
    } //Sort by closest to Mahjong


    return b.handOption.score - a.handOption.score; //Sort by score.
  });
  return results;
}

function outputExpander(combos) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.time("Expand");
  var output = [];
  var duplicatesRemoved = 0;
  combos.forEach(function (combo) {
    //combo composes all the possibilities that one item on the card can be
    var comboOutput = [];
    combo.tiles.forEach(function (tileCombo) {
      //Create a seperate object for each possibility
      var obj = Object.assign({}, combo);
      obj.tiles = tileCombo;

      if (obj.tiles.flat().length !== 14) {
        throw "Invalid Combo";
      }

      comboOutput.push(obj);
    }); //Combos might include duplicate outputs - while they wouldn't if they were ideally designed, using the first two
    //of three set permutations is extremely useful, generating extra possibilities as a side effect.
    //We don't currently check for duplicate outputs outside of combos.
    //Duplicate checking slows stuff down quite a bit - it is a one time cost, but if it is too slow, it might need
    //to be optimized even more, to only run on specific combos, etc.

    if (!combo.skipDuplicateRemoval) {
      var uniqueCombos = [];

      for (var i = 0; i < comboOutput.length; i++) {
        var _getTileDifferential$;

        var _combo = comboOutput[i];

        if (((_getTileDifferential$ = getTileDifferential(uniqueCombos, _combo.tiles)[0]) === null || _getTileDifferential$ === void 0 ? void 0 : _getTileDifferential$.diff) === 0) {
          duplicatesRemoved++;
        } else {
          uniqueCombos.push(_combo);
        }
      }

      output.push.apply(output, uniqueCombos);
    } else {
      //Marvelous hands easily blow the duplicate remover to pieces. It's quadratic.
      console.warn("Skipping Duplicate Removal");
      delete combo.skipDuplicateRemoval;
      output.push.apply(output, comboOutput);
    }
  });
  console.timeEnd("Expand");

  if (duplicatesRemoved) {
    console.warn("Removed " + duplicatesRemoved + " Duplicate Combos");
  }

  return output;
}

var nonJokerTiles = Wall.getNonPrettyTiles(1);
nonJokerTiles.push(new Tile({
  type: "flower"
}));
module.exports = {
  nonJokerTiles: nonJokerTiles,
  createTiles: createTiles,
  allSuits: allSuits,
  allSuitArrangements: allSuitArrangements,
  oddOptions: oddOptions,
  evenOptions: evenOptions,
  allOptions: allOptions,
  windOptions: windOptions,
  dragonOptions: dragonOptions,
  dragonArrangments: dragonArrangments,
  suitDragonConversion: suitDragonConversion,
  outputExpander: outputExpander,
  getTileDifferential: getTileDifferential
};

/***/ }),

/***/ 5025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(5837);

__webpack_require__(4747);

__webpack_require__(6755);

__webpack_require__(3210);

__webpack_require__(9600);

__webpack_require__(6699);

__webpack_require__(2023);

var Room = __webpack_require__(8258);

var Client = __webpack_require__(927);

var path, fs, crypto;

try {
  path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  crypto = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'crypto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {
  console.warn(e);
}

function getMessage(type, message, status) {
  return JSON.stringify({
    type: type,
    message: message,
    status: status
  });
}

function onConnection(websocket) {
  var clientId;
  websocket.on('message', function incoming(message) {
    try {
      var obj;

      try {
        obj = JSON.parse(message);
      } catch (e) {
        return websocket.send(getMessage("error", "Message must be valid JSON"));
      }

      console.log('received: ' + JSON.stringify(obj)); //Admin actions for triggering maintenance.
      //Example:
      //stateManager.messageAllServerClients(password, "Server Update", "Mahjong 4 Friends will be entering maintenance in a few minutes to perform a server update. Feel free to continue playing - all games will be restored to where they were before the start of maintenance. ")
      //stateManager.callServerSave(password, "update")
      //stateManager.messageAllServerClients(password, "Server Update", "Mahjong 4 Friends is shutting down to perform a server update. \nIf all goes well, your current game should resume within a minute. ")
      //Then apply the update, and start the server loading from the state.
      //That should probably be done by editing crontab before reboot, then editing back.
      //stateManager.messageAllServerClients(password, "Reconnected", "Mahjong 4 Friends is back up. You may need to reload your page or restart the app, and your game might have gone back a turn or two. Please report any issues to support@mahjong4friends.com")

      if (obj.type === "callServerSave" || obj.type === "messageAllServerClients") {
        if (!obj.auth) {
          return websocket.send(getMessage("displayMessage", {
            title: "Auth Error",
            body: "This command must be authed"
          }, "error"));
        }

        var hash = crypto.createHash("sha256").update(obj.auth).digest("hex");

        if (hash !== "014eea3157474ede4dccc818d1a84efff650b82b8d67d3470f46e4ecc2f5d829") {
          return websocket.send(getMessage("displayMessage", {
            title: "Auth Error",
            body: "Invalid Admin Password"
          }, "error"));
        }

        if (obj.type === "callServerSave") {
          return websocket.send(getMessage("displayMessage", {
            title: "Server Save",
            body: globalThis.saveServerState(obj.saveName)
          }, "error"));
        } else if (obj.type === "messageAllServerClients") {
          globalThis.serverStateManager.getAllClients().forEach(function (client) {
            client.message("displayMessage", {
              title: obj.title,
              body: obj.body
            }, "error");
          });
        }

        return;
      }

      var client;

      if (!clientId && !obj.clientId) {
        return websocket.send(getMessage("error", "No clientId specified"));
      } else {
        clientId = obj.clientId;

        if (!globalThis.serverStateManager.getClient(clientId)) {
          if (clientId.startsWith("bot")) {
            //Intended for dev use.
            client = globalThis.serverStateManager.createBot(clientId, websocket);
          } else {
            client = globalThis.serverStateManager.createClient(clientId, websocket);
          }
        } else {
          client = globalThis.serverStateManager.getClient(clientId);
          client.setWebsocket(websocket);
        }
      }

      if (obj.type === "createRoom") {
        if (typeof obj.roomId !== "string" || obj.roomId.trim().length === 0) {
          return websocket.send(getMessage("createRoom", "roomId must be a string with at least one character", "error"));
        } else if (globalThis.serverStateManager.getRoom(obj.roomId)) {
          return websocket.send(getMessage("createRoom", "Room Already Exists", "error"));
        } else {
          client.setNickname(obj.nickname);
          globalThis.serverStateManager.createRoom(obj.roomId).addClient(clientId);
          client.setRoomId(obj.roomId);
          return websocket.send(getMessage("createRoom", obj.roomId, "success"));
        }
      } else if (obj.type === "joinRoom") {
        if (!globalThis.serverStateManager.getRoom(obj.roomId)) {
          return websocket.send(getMessage("joinRoom", "Room Does Not Exist", "error"));
        }

        client.setNickname(obj.nickname);
        return globalThis.serverStateManager.getRoom(obj.roomId).addClient(clientId);
      } else if (obj.type === "getCurrentRoom") {
        console.log(client.getRoomId());
        var roomId = client.getRoomId();
        client.message(obj.type, roomId, "success");
        return websocket.send(getMessage(obj.type, roomId, "success"));
      } else if (obj.type === "createRoomFromState") {
        //Intended for developer use.
        try {
          var roomFilePath = path.join(globalThis.serverStateManager.serverDataDirectory, obj.saveId + ".room");

          if (fs.existsSync(roomFilePath)) {
            //Technically roomPath could be a ../ path, however this kind of "hacking" shouldn't do any damage here. We don't write or expose non-mahjong data.
            var room = Room.fromJSON(fs.readFileSync(roomFilePath, {
              encoding: "utf8"
            }));
            var _roomId = room.roomId;

            if (!globalThis.serverStateManager.createRoom(_roomId, room)) {
              return console.warn("Room already exists. ");
            }

            room.init();
          } else {
            console.warn("Invalid save path");
          }
        } catch (e) {
          console.error(e);
        }

        return;
      } else if (obj.type.includes("roomAction")) {
        //The user is in a room, and this action will be handled by the room.
        var _room = globalThis.serverStateManager.getRoom(obj.roomId) || client.getRoom();

        if (!_room) {
          //The user did not specify a valid room to use, and was not in a room.
          return websocket.send(getMessage(obj.type, "Room Does Not Exist", "error"));
        } //console.log(room)


        try {
          return _room.onIncomingMessage(clientId, obj);
        } catch (e) {
          console.error(e);
          console.error(e.stack);
          return;
        }
      }

      console.log("Nothing happened. ");
    } catch (e) {
      //Uncaught exceptions now cause server to crash since NodeJS update.
      console.error(e);
    }
  });
}

module.exports = onConnection;

/***/ }),

/***/ 4696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

__webpack_require__(4747);

__webpack_require__(9653);

__webpack_require__(2222);

__webpack_require__(7327);

__webpack_require__(4944);

__webpack_require__(9600);

__webpack_require__(3123);

__webpack_require__(4916);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(1249);

__webpack_require__(3290);

__webpack_require__(2772);

__webpack_require__(7042);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

var Wall = __webpack_require__(6212);

var Popups = __webpack_require__(4376);

var Sequence = __webpack_require__(7793);

var Match = __webpack_require__(9458);

var gameBoard = document.createElement("div");
gameBoard.id = "gameBoard";
document.body.appendChild(gameBoard);

function createTopOrBottomHand(handId) {
  var hand = document.createElement("div");
  hand.id = handId;
  gameBoard.appendChild(hand);
  return hand;
}

function createLeftOrRightHand(handId, containerId) {
  var hand = createTopOrBottomHand(handId); //We will return the container for the tiles. A container is used for the left and right hands in order to vertically center the tiles.

  var container = document.createElement("div");
  container.id = containerId;
  hand.appendChild(container);
  return container;
}

function Compass() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  config.id = config.id || "compass";
  this.compass = document.createElement("img");
  this.compass.id = config.id;
  gameBoard.appendChild(this.compass);

  this.setDirectionForUserWind = function (userWind) {
    this.compass.src = "assets/compass-" + userWind + ".svg";
  };
}

var compass = new Compass({
  id: "compass"
});

function FullscreenControls(elementId) {
  var goFullscreenImage = "assets/go-full-screen.svg";
  var exitFullscreenImage = "assets/exit-full-screen.svg";

  if (!document.fullscreenEnabled && document.webkitFullscreenEnabled) {
    //We'll add some support for the webkit prefix.
    Object.defineProperty(document, "fullscreenElement", {
      get: function get() {
        return document.webkitFullscreenElement;
      }
    });

    document.documentElement.requestFullscreen = function () {
      document.documentElement.webkitRequestFullScreen();
    };

    document.exitFullscreen = function () {
      document.webkitExitFullscreen();
    };

    document.addEventListener("webkitfullscreenchange", function () {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
  }

  if (document.fullscreenElement !== undefined) {
    //Support check. This allows users to check toggleElement.
    this.toggleElement = document.createElement("img");
    this.toggleElement.id = elementId;
    this.toggleElement.title = "Toggle Full Screen";
    this.toggleElement.addEventListener("click", function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });

    var setIcon = function setIcon() {
      if (document.fullscreenElement) {
        this.toggleElement.src = exitFullscreenImage;
      } else {
        this.toggleElement.src = goFullscreenImage;
      }
    }.bind(this);

    document.addEventListener("fullscreenchange", setIcon);
    setIcon();
  }
}

var fullscreenControls = new FullscreenControls("fullscreenControls");

if (fullscreenControls.toggleElement) {
  gameBoard.appendChild(fullscreenControls.toggleElement);
}

var syncButton = document.createElement("img");
syncButton.src = "assets/reload-icon.svg";
syncButton.id = "syncButton";
syncButton.title = "Sync (Reload)";
gameBoard.appendChild(syncButton);
syncButton.addEventListener("click", function () {
  window.location.reload();
});
window.Tile = Tile;
window.Sequence = __webpack_require__(7793);
window.Match = __webpack_require__(9458);

function createTilePlacemat() {
  var tilePlacemat = document.createElement("div");
  tilePlacemat.id = "tilePlacemat";
  return tilePlacemat;
}

var tilePlacemat = createTilePlacemat();
gameBoard.appendChild(tilePlacemat);
var revertStateButton = document.createElement("button");
revertStateButton.id = "revertStateButton";
revertStateButton.innerHTML = "Revert";
gameBoard.appendChild(revertStateButton);
revertStateButton.addEventListener("click", function () {
  var res = prompt("How many moves (4 moves per turn) would you like to revert? You can always revert more if needed, but can't undo a revert. ");

  if (res !== null && confirm("Are you sure you would like to revert the game state? Other players will be notified, so you should clear the revert with them. ")) {
    window.stateManager.revertState(res);
  }
});
var swapJokerButton = document.createElement("button");
swapJokerButton.id = "swapJokerButton";
swapJokerButton.innerHTML = "Swap Joker";
gameBoard.appendChild(swapJokerButton);
swapJokerButton.addEventListener("click", function () {
  if (userHand.inPlacemat.length !== 1) {
    new Popups.Notification("Error With Swap", "You must have exactly one tile in your placemat to swap - act like you are going to discard the tile, but hit Swap Joker instead of proceed. ").show();
    return;
  }

  var elem = document.createElement("div");
  var p = document.createElement("p");
  p.innerHTML = "Who would you like to try and swap with?";
  elem.appendChild(p);
  var popup; //TODO: Consider adding an "auto" to this.

  stateManager.lastState.message.clients.forEach(function (item, i) {
    var btn = document.createElement("button");
    btn.innerHTML = item.nickname;
    btn.className = "swapJokerOptionMenuButton";

    if (item.id === window.clientId) {
      btn.innerHTML += " (You)";
    }

    elem.appendChild(btn);
    btn.addEventListener("click", function () {
      window.stateManager.placeTiles(userHand.inPlacemat, false, {
        swapJoker: item.id
      });
      popup.dismiss();
    });
  });
  popup = new Popups.Notification("Swap Tile For Joker", elem);
  popup.show();
});
var proceedButton = document.createElement("button");
proceedButton.id = "proceedButton";
proceedButton.innerHTML = "Proceed";
gameBoard.appendChild(proceedButton);
proceedButton.addEventListener("click", function () {
  var placement = userHand.inPlacemat; //If the user has 0 tiles in placemat, or 1 tile, which is the thrown one, next turn.

  if (placement.length === Number(placement.some(function (obj) {
    return obj.evicting;
  }))) {
    window.stateManager.placeTiles([]);
    return;
  }

  console.log(placement);
  window.stateManager.placeTiles(placement);
});

window.stateManager.onPlaceTiles = function (obj) {
  if (obj.status === "error") {
    new Popups.Notification("Error Placing Tiles", obj.message).show();
  }
};

var hintButton = document.createElement("button");
hintButton.id = "hintButton";
hintButton.innerHTML = "Suggested Hands";
gameBoard.appendChild(hintButton);
hintButton.addEventListener("click", function () {
  var popup;

  try {
    var cardName = stateManager.lastState.message.settings.card;

    if (cardName === "Other Card - Bots Use Random Card") {
      popup = new Popups.Notification("Suggested Hands", "This card does not support Suggested Hands. ");
    } else {
      var cards = __webpack_require__(6587);

      var utilities = __webpack_require__(2976);

      var card = cards[cardName];
      var tiles = userHand.contents.concat(userHand.inPlacemat.filter(function (tile) {
        return !tile.evicting;
      }));
      var options = utilities.getTileDifferential(card, tiles);

      if (options.length === 0) {
        popup = new Popups.Notification("No Hands Found", " - Your hand might be dead<br> - You might have selected the wrong card (using ".concat(cardName, "). <br> - Bots might only support a portion of your card"));
      } else {
        var elem = document.createElement("div");
        var p = document.createElement("p");
        p.innerHTML = "(Sorted by Bot - Scroll to see more)";
        elem.appendChild(p);
        var table = document.createElement("table");
        options.forEach(function (item, index) {
          if (index < 100) {
            var row = document.createElement("tr");
            table.appendChild(row);
            var nameColumn = document.createElement("td");
            nameColumn.innerHTML = "".concat(item.handOption.section, " #").concat(item.handOption.cardIndex + 1, " - ").concat(item.diff, " Tiles Away (").concat(item.handOption.concealed ? "C" : "X", ")");
            row.appendChild(nameColumn);
            var tileRow = document.createElement("tr");
            table.appendChild(tileRow);
            item.handOption.tiles.flat().forEach(function (tile) {
              var img = document.createElement("img");
              img.src = tile.imageUrl;
              tileRow.appendChild(img);
            });
          }
        });
        elem.appendChild(table);
        table.className = "suggestedHandsTable";
        console.log(elem);
        popup = new Popups.Notification("Suggested Hands", elem);
      }
    }
  } catch (e) {
    console.error(e);
    popup = new Popups.Notification("Suggested Hands", "There was an error displaying suggested hands. Sorry. ");
  }

  popup.show();
});
console.log(hintButton);
var instructionBubble = document.createElement("div");
instructionBubble.id = "instructionBubble";
instructionBubble.style.display = "none";
gameBoard.appendChild(instructionBubble);
window.stateManager.addEventListener("onStateUpdate", function (obj) {
  instructionBubble.style.display = "";
  instructionBubble.innerHTML = obj.message.instructions.split("\n").join("<br>");
});

window.stateManager.onGameplayAlert = function (obj) {
  var _obj$status, _obj$status2;

  //Play sound.
  var sound = document.createElement("audio");
  var baseUrl = "assets/sounds/";
  var urls = [];

  if (obj.message.includes("thrown")) {
    sound.volume = 0.5; //urls = ["tile-drop-table.mp3"]
  } else if (obj.message.includes("mahjong")) {
    sound.volume = 1; //urls = ["tiles-dropping-table.mp3"]
  }

  if (urls.length > 0) {
    sound.src = baseUrl + urls[Math.floor(Math.random() * urls.length)];
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    sound.play();
    setTimeout(function () {
      sound.remove();
    }, 2000);
  }

  console.log(obj);
  console.log(obj.message);
  var alert = new Popups.BlocklessAlert(obj.message, 4000 * ((obj === null || obj === void 0 ? void 0 : (_obj$status = obj.status) === null || _obj$status === void 0 ? void 0 : _obj$status.durationMultiplier) || 1), {
    optional: obj === null || obj === void 0 ? void 0 : (_obj$status2 = obj.status) === null || _obj$status2 === void 0 ? void 0 : _obj$status2.optional
  });
  console.log(alert);
  alert.onStart.then(function () {
    var _obj$status3, _obj$status4;

    if (window.voiceChoices[obj === null || obj === void 0 ? void 0 : (_obj$status3 = obj.status) === null || _obj$status3 === void 0 ? void 0 : _obj$status3.clientId] && obj !== null && obj !== void 0 && (_obj$status4 = obj.status) !== null && _obj$status4 !== void 0 && _obj$status4.speech) {
      //TODO: SPEAK!!!
      var utterance = new SpeechSynthesisUtterance(obj.status.speech);
      var voice = window.voiceChoices[obj.status.clientId].get();
      console.log(window.voiceChoices[obj.status.clientId]);
      console.log(window.voiceChoices[obj.status.clientId].get());
      console.log(voice);

      if (typeof voice !== "string") {
        try {
          utterance.voice = voice;
        } catch (e) {
          console.error(e);
        }
      }

      if (voice !== "none") {
        speechSynthesis.speak(utterance);
      }
    }
  });
};

var endGameButton = document.createElement("button");
endGameButton.id = "endGameButton";
gameBoard.appendChild(endGameButton);
var newGameNoLobbyButton = document.createElement("button");
newGameNoLobbyButton.id = "newGameNoLobbyButton";
newGameNoLobbyButton.innerHTML = "New Game";
gameBoard.appendChild(newGameNoLobbyButton);
var shouldConfirm = true;
endGameButton.addEventListener("click", function () {
  //Require confirmation unless the game is over. Note that this might be slightly bugged with revert.
  if (endGameButton.innerHTML === "Leave Room" //Spectating
  || !shouldConfirm || confirm("Are you absolutely sure you want to end the game?")) {
    window.stateManager.endGame();
  }
});
newGameNoLobbyButton.addEventListener("click", function () {
  endGameButton.click(); //Calling startGame when in a game does nothing, so it's fine to call it without guards.

  document.getElementById("startGameButton").click(); //Clicks button on RoomManager - not currently visible.
});
var goMahjongButton = document.createElement("button");
goMahjongButton.id = "goMahjongButton";
goMahjongButton.innerHTML = "Mahjong";
gameBoard.appendChild(goMahjongButton);
goMahjongButton.addEventListener("click", function () {
  var placement = userHand.inPlacemat;
  console.log(placement);
  window.stateManager.placeTiles(placement, {
    mahjong: true
  });
});
var wallAndDiscardContainer = document.createElement("div");
wallAndDiscardContainer.id = "wallAndDiscardContainer";
gameBoard.appendChild(wallAndDiscardContainer);
var wallRendering = document.createElement("div");
wallRendering.id = "wall";
wallAndDiscardContainer.appendChild(wallRendering);
var discardPile = document.createElement("div");
discardPile.id = "discardPile";
wallAndDiscardContainer.appendChild(discardPile);

function renderDiscardPile(tileStrings) {
  while (discardPile.firstChild) {
    discardPile.firstChild.remove();
  }

  var tiles = tileStrings.map(function (str) {
    return Tile.fromJSON(str);
  });
  tiles = Hand.sortTiles(tiles);
  tiles.forEach(function (tile) {
    var _stateManager, _stateManager$lastSta, _stateManager$lastSta2, _stateManager$lastSta3;

    var img = document.createElement("img");
    img.src = tile.imageUrl;
    img.title = tile.getTileName((_stateManager = stateManager) === null || _stateManager === void 0 ? void 0 : (_stateManager$lastSta = _stateManager.lastState) === null || _stateManager$lastSta === void 0 ? void 0 : (_stateManager$lastSta2 = _stateManager$lastSta.message) === null || _stateManager$lastSta2 === void 0 ? void 0 : (_stateManager$lastSta3 = _stateManager$lastSta2.settings) === null || _stateManager$lastSta3 === void 0 ? void 0 : _stateManager$lastSta3.gameStyle);
    discardPile.appendChild(img);
  });
}

var userHandElem = createTopOrBottomHand("userHand");
var userHandElemExposed = createTopOrBottomHand("userHandExposed");
var userHand = new Hand({
  handToRender: userHandElem,
  handForExposed: userHandExposed,
  interactive: true,
  tilePlacemat: tilePlacemat
});
window.userHand = userHand;
var rightHandContainer = createLeftOrRightHand("rightHand", "rightHandContainer");
var rightHand = new Hand({
  handToRender: rightHandContainer
});
var topHandElem = createTopOrBottomHand("topHand");
var topHand = new Hand({
  handToRender: topHandElem
});
var leftHandContainer = createLeftOrRightHand("leftHand", "leftHandContainer");
var leftHand = new Hand({
  handToRender: leftHandContainer
});
var nametagIds = ["bottomNametag", "rightNametag", "topNametag", "leftNametag"];
var nametags = nametagIds.map(function (id) {
  var nametag = document.createElement("p");
  nametag.id = id;
  gameBoard.appendChild(nametag);
  return nametag;
});
var showSpectating = true; //We place the changed tiles into the placemat during charleston. We employ this check to stop the initial state sync after a reload or
//game start in american mahjong from filling the placemat with the first 3 tiles in the hand (as the entire hand changed)

var charlestonStart = false;
window.stateManager.addEventListener("onStateUpdate", function (obj) {
  var _obj$message, _obj$message$settings, _message$settings, _message$currentTurn2, _message$currentTurn4, _message$currentTurn5;

  if (window.stateManager.isHost) {
    newGameNoLobbyButton.style.display = "";
  } else {
    newGameNoLobbyButton.style.display = "none";
  }

  gameBoard.className = obj === null || obj === void 0 ? void 0 : (_obj$message = obj.message) === null || _obj$message === void 0 ? void 0 : (_obj$message$settings = _obj$message.settings) === null || _obj$message$settings === void 0 ? void 0 : _obj$message$settings.gameStyle; //Buttons use this class to determine layout and visibility.

  var message = obj.message;
  shouldConfirm = !message.isGameOver;
  hintButton.style.display = "";
  proceedButton.classList.add("shrinkForHintButton");

  if (message !== null && message !== void 0 && (_message$settings = message.settings) !== null && _message$settings !== void 0 && _message$settings.disableHints) {
    hintButton.style.display = "none";
    proceedButton.classList.remove("shrinkForHintButton");
  }

  if (!message.inGame) {
    document.body.style.overflow = "";
    charlestonStart = false;
    return;
  }

  ;
  document.body.style.overflow = "hidden";

  if (message.wallTiles !== undefined) {
    if (_typeof(message.wallTiles) === "object") {
      message.wallTiles = Hand.convertStringsToTiles(message.wallTiles);
    } else {
      message.wallTiles = new Array(message.wallTiles).fill(new Tile({
        faceDown: true
      }));
    }

    Wall.renderWall(wallRendering, message.wallTiles);
  }

  if (message.discardPile) {
    renderDiscardPile(message.discardPile);
  }

  var clients = message.clients;
  var winds = ["north", "east", "south", "west"];
  var hands = [userHand, rightHand, topHand, leftHand];
  var userWind;
  clients.forEach(function (client) {
    if (client.hand) {
      var _message$currentTurn;

      var tempHand = Hand.fromString(client.hand);
      userHand.syncContents(tempHand.contents, charlestonStart && (message === null || message === void 0 ? void 0 : (_message$currentTurn = message.currentTurn) === null || _message$currentTurn === void 0 ? void 0 : _message$currentTurn.charleston));
      userWind = tempHand.wind;
    }
  });

  if (message !== null && message !== void 0 && (_message$currentTurn2 = message.currentTurn) !== null && _message$currentTurn2 !== void 0 && _message$currentTurn2.charleston) {
    charlestonStart = true;
  }

  var userWindIndex = winds.indexOf(userWind);
  var windOrder = winds.slice(userWindIndex).concat(winds.slice(0, userWindIndex));

  if (!userWind) {
    //Must be spectating.
    compass.setDirectionForUserWind(windOrder[0]);
    endGameButton.innerHTML = "Leave Room";

    if (showSpectating) {
      new Popups.MessageBar("You are spectating (message will close automatically)").show(10000);
      showSpectating = false;
    }
  } else {
    compass.setDirectionForUserWind(userWind);
    endGameButton.innerHTML = "End Game";
  }

  clients.forEach(function (client) {
    var windPosition = 0;

    if (client.wind) {
      windPosition = windOrder.indexOf(client.wind);
    }

    var hand = hands[windPosition];

    if (client.visibleHand && client.wind) {
      hand.syncContents(Hand.convertStringsToTiles(client.visibleHand));
      hand.wind = client.wind;
    }

    var nametag = nametags[windPosition];
    nametag.innerHTML = client.nickname;
    nametag.style.color = "";
    hand.handToRender.classList.remove("brightnessPulse");

    if (message.currentTurn && client.id === message.currentTurn.userTurn) {
      hand.handToRender.classList.add("brightnessPulse");
      nametag.style.color = "red";
    }
  });
  hands.forEach(function (hand) {
    var _message$currentTurn3;

    hand.renderTiles(message === null || message === void 0 ? void 0 : (_message$currentTurn3 = message.currentTurn) === null || _message$currentTurn3 === void 0 ? void 0 : _message$currentTurn3.lastDrawn);
  }); //lastDrawn only affects unexposed tiles, so there isn't a problem passing it to all.

  swapJokerButton.disabled = "";

  if (((_message$currentTurn4 = message.currentTurn) === null || _message$currentTurn4 === void 0 ? void 0 : (_message$currentTurn5 = _message$currentTurn4.playersReady) === null || _message$currentTurn5 === void 0 ? void 0 : _message$currentTurn5.length) > 0) {
    //The person has thrown their tile. Waiting on players to ready.
    var clientIdReady = message.currentTurn.playersReady.includes(window.clientId);
    proceedButton.disabled = clientIdReady ? "disabled" : "";
    goMahjongButton.disabled = clientIdReady ? "disabled" : "";
    swapJokerButton.disabled = "disabled";
    proceedButton.innerHTML = "Proceed (" + message.currentTurn.playersReady.length + "/4)"; //If you haven't thrown, are not in charleston, and it is your turn, override and enable.

    if (!message.currentTurn.thrown && !message.currentTurn.charleston && message.currentTurn.userTurn === clientId) {
      proceedButton.disabled = "";
    }

    if (message.currentTurn.charleston && message.currentTurn.userTurn !== clientId) {
      //You have 13 tiles. Mahjong impossible.
      goMahjongButton.disabled = "disabled";
    }

    if (message.currentTurn.userTurn !== clientId) {
      userHand.setEvictingThrownTile(Tile.fromJSON(message.currentTurn.thrown));
    } else {
      userHand.setEvictingThrownTile(); //Clear evictingThrownTile
    }

    userHand.renderPlacemat("");
  } else {
    proceedButton.disabled = "";
    goMahjongButton.disabled = "";
    proceedButton.innerHTML = "Proceed";
    userHand.setEvictingThrownTile(); //Clear evictingThrownTile
    //The person has not yet thrown a tile.

    if (message.currentTurn.charleston) {
      //TODO: Not sure if East wind is allowed to go Mahjong during a charleston. As of now, Room.js will treat mahjong just like place tiles during charleston,
      //so we'll disable the option
      goMahjongButton.disabled = "disabled";
    }

    if (message.currentTurn.userTurn === window.clientId) {
      userHand.renderPlacemat("pending");
      swapJokerButton.disabled = "";
    } else {
      swapJokerButton.disabled = "disabled";

      if (!message.currentTurn.charleston) {
        proceedButton.disabled = "disabled";
        goMahjongButton.disabled = "disabled";
      }
    }
  }

  if (!proceedButton.disabled && !message.isGameOver) {
    proceedButton.classList.add("scaleAnimation");
  } else {
    proceedButton.classList.remove("scaleAnimation");
  }

  if (message.isGameOver) {
    proceedButton.innerHTML = "View Scores";
  }
});
proceedButton.addEventListener("click", function () {
  //When clicked, remove proceed button scale animation.
  proceedButton.style.animation = "none";
  setTimeout(function () {
    proceedButton.style.animation = "";
  }, 100);
}); //Add hotkeys

document.addEventListener("keyup", function (e) {
  var chars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f"]; //qwertyuiopasdf will correspond to first 14 hand spots. Pressing will move to placemat.

  if (!stateManager.inGame) {
    return;
  }

  if (e.code === "Space" && e.shiftKey) {
    goMahjongButton.click();
  } else if (e.code === "Space") {
    proceedButton.click();
  } else if (Number(e.key) > 0 && Number(e.key) < 5) {
    //1,2,3, and 4 will correspond to the 4 placemat spots. Pressing them will remove the specified tile.
    var pos = Number(e.key) - 1;
    userHand.moveTile(userHand.inPlacemat[pos]);
  } else if (chars.includes(e.key.toLowerCase())) {
    var index = chars.indexOf(e.key.toLowerCase());
    var tiles = userHand.contents.filter(function (item) {
      return item instanceof Tile;
    });
    userHand.moveTile(tiles[index]);
  }
});

function handleScreenResize() {
  topHand.renderTiles();
  leftHand.renderTiles();
  rightHand.renderTiles();
  userHand.renderTiles();
}

window.addEventListener("resize", handleScreenResize);
window.addEventListener("orientationchange", handleScreenResize);
window.addEventListener("scroll", function (event) {
  if (window.stateManager.inGame) {
    window.scrollTo(0, 0);
  }
});
module.exports = gameBoard;

/***/ }),

/***/ 2169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(561);

__webpack_require__(2772);

__webpack_require__(4747);

__webpack_require__(3290);

__webpack_require__(6699);

__webpack_require__(2707);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(7327);

__webpack_require__(4553);

__webpack_require__(1249);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(2946);

var Match = __webpack_require__(9458);

var Sequence = __webpack_require__(7793);

var Pretty = __webpack_require__(4810);

var Wall = __webpack_require__(6212);

var TileContainer = __webpack_require__(502);

var Hand = /*#__PURE__*/function () {
  "use strict";

  function Hand() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Hand);

    //handForExposed - Optional. If exposed tiles should be placed in a seperate hand, they will be placed here.
    //interactive: Can the user drag and drop to reorder? Click to swap between hand and placemat?
    //tilePlacemat: Element that will allow user to select tiles to expose.
    this.handToRender = config.handToRender;
    this.handForExposed = config.handForExposed;
    this.tilePlacemat = config.tilePlacemat;
    this.interactive = config.interactive || false;
    this.wind = config.wind; //We will also have one events: this.onPlacematChange

    this.contents = []; //Contents of hand.

    this.inPlacemat = []; //Additional contents of hand. In placemat.

    this.syncContents = __webpack_require__(974).bind(this);
    this.score = __webpack_require__(839).bind(this);
    this.getClearHandDoubles = __webpack_require__(9064).bind(this);
    this.isMahjong = __webpack_require__(5867).bind(this);
    this.isCalling = __webpack_require__(6527).bind(this);
    Object.defineProperty(this, "placematLength", {
      get: function getPlacematLength() {
        var _stateManager, _stateManager$lastSta, _stateManager$lastSta2, _stateManager$lastSta3;

        if (((_stateManager = stateManager) === null || _stateManager === void 0 ? void 0 : (_stateManager$lastSta = _stateManager.lastState) === null || _stateManager$lastSta === void 0 ? void 0 : (_stateManager$lastSta2 = _stateManager$lastSta.message) === null || _stateManager$lastSta2 === void 0 ? void 0 : (_stateManager$lastSta3 = _stateManager$lastSta2.settings) === null || _stateManager$lastSta3 === void 0 ? void 0 : _stateManager$lastSta3.gameStyle) === "american") {
          return 6;
        } else {
          return 4;
        }
      }
    });

    this.add = function (obj) {
      //We will insert the tile where our sorting algorithm would find it most appropriate.
      //TODO: this should probably receive some improvement, as if the user changes the location of suits, or puts, say honors first, it will fail to properly insert.
      var newItemScore;

      if (obj instanceof Sequence) {
        newItemScore = Hand.getTileValue(obj.tiles[0]); //Use value of first tile in sequence.
      } else if (obj instanceof TileContainer) {
        //Same as sequence for now - use first tile.
        newItemScore = Hand.getTileValue(obj.tiles[0]); //Use value of first tile in sequence.
      } else {
        newItemScore = Hand.getTileValue(obj);
      }

      for (var i = 0; i < this.contents.length; i++) {
        //Find where to insert this tile.
        var currentItem = this.contents[i];

        if (currentItem instanceof Sequence) {
          //Not quite sure how to handle this.
          currentItem = currentItem.tiles[2]; //Get the value using the last tile in sequence.
        }

        if (currentItem instanceof TileContainer) {
          //Use the first tile in container.
          currentItem = currentItem.tiles[0];
        }

        var currentScore = Hand.getTileValue(currentItem); //Value of the tile in that position

        if (newItemScore < currentScore) {
          this.contents.splice(i, 0, obj);
          return;
        }
      }

      this.contents.push(obj);
    }.bind(this);

    this.remove = function (obj) {
      var index = this.contents.indexOf(obj);
      var placematIndex = this.inPlacemat.indexOf(obj);

      if (index !== -1) {
        this.contents.splice(index, 1);
      } else if (placematIndex !== -1) {
        this.inPlacemat.splice(placematIndex, 1);
      } else {
        throw obj + " does not exist in hand. ";
      }
    }.bind(this);

    this.moveTile = function moveTile(tile) {
      var switchPlace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var targetPosition = arguments.length > 2 ? arguments[2] : undefined;
      //Tile is the object in either the hand or placemat.
      //targetPosition is the position to the left of where we want to move this tile.
      var placematIndex = this.inPlacemat.indexOf(tile);
      var contentsIndex = this.contents.indexOf(tile);
      console.log(targetPosition);

      if (placematIndex + contentsIndex === -2) {
        console.error("Tile does not exist. ");
        return;
      }

      var target = [this.inPlacemat, this.contents];

      if (switchPlace) {
        if (placematIndex === -1) {
          //Moving from hand to placemat.
          if (this.inPlacemat.length >= this.placematLength) {
            alert("Placemat is already full. ");
            return;
          } else {
            this.inPlacemat.push(this.contents.splice(contentsIndex, 1)[0]);
          }
        } else {
          //Moving from placemat to hand.
          if (placematIndex === 0 && this.inPlacemat[0].evicting) {
            alert("This tile was discarded. To claim it, select the tiles you would like to match with it, then hit proceed. ");
            return;
          }

          var currentTile = this.inPlacemat.splice(placematIndex, 1)[0];

          if (!isNaN(targetPosition)) {
            //Moving to specfic place in hand.
            this.contents.splice(targetPosition, 0, currentTile);
          } else {
            //Add with auto sort.
            this.add(currentTile);
          }
        }
      } else if (!isNaN(targetPosition)) {
        if (contentsIndex === -1) {
          console.error("Reordering in placemat is not supported. Must be in hand.");
        } else {
          if (targetPosition > contentsIndex) {
            targetPosition--;
          } //Compensate for the splice.


          this.contents.splice(targetPosition, 0, this.contents.splice(contentsIndex, 1)[0]);
        }
      } else {
        console.error("Unable to determine how this tile should be moved. ");
      }

      this.renderTiles(); //Re-render.

      this.renderPlacemat(); //Not sure if this is needed?
    }.bind(this);

    this.removeMatchingTile = function (obj) {
      var _this = this;

      //Removes a Tile that matches the object passed, although may not be the same objet.
      if (!obj instanceof Tile) {
        throw "removeMatchingTile only supports Tiles";
      }

      if (this.inPlacemat.length > 0) {
        console.warn("Hand.removeMatchingTile is intended for server side use only. ");
      }

      if (this.contents.some(function (item, index) {
        if (obj.matches(item)) {
          _this.contents.splice(index, 1);

          return true;
        }

        return false;
      }.bind(this))) {
        return true;
      }

      return false;
    };

    this.getExposedTiles = function () {
      var includeFaceDown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var exposedTiles = [];
      this.contents.forEach(function (item) {
        if (item.exposed) {
          exposedTiles.push(item);
        } else if (item instanceof Match && item.amount === 4) {
          //If it is stored as a match, but not exposed, is in hand kong.
          //Is not stored as a match if the user never placed them down
          exposedTiles.push(item);
        } else if (includeFaceDown) {
          exposedTiles.push(new Tile({
            faceDown: true
          }));
        }
      });
      return exposedTiles;
    }.bind(this);

    function allowDrop(ev) {
      ev.preventDefault();
    }

    function dragstart(ev) {
      var randomClass = "randomClassForTransfer" + Math.pow(2, 53) * Math.random();
      ev.target.classList.add(randomClass);
      ev.dataTransfer.setData("randomClass", randomClass);
    }

    var dropOnHand = function dropOnHand(ev) {
      ev.preventDefault();
      var randomClass = ev.dataTransfer.getData("randomClass");
      var elem = document.getElementsByClassName(randomClass)[0];
      elem.classList.remove(randomClass);
      var targetIndex;

      for (var i = 0; i < this.handToRender.children.length; i++) {
        var child = this.handToRender.children[i];
        var bounds = child.getBoundingClientRect();
        targetIndex = child.tileIndex + 1;

        if (ev.clientX < bounds.left + bounds.width / 2) {
          //This child is to the left of the drop point.
          targetIndex--; //Should not be at the very end.

          break;
        }
      }

      if (elem.placematIndex !== undefined) {
        //We are dragging out of the placemat, into the hand.
        this.moveTile(this.inPlacemat[elem.placematIndex], true, targetIndex);
      } else {
        //Reordering hand.
        this.moveTile(this.contents[elem.tileIndex], false, targetIndex);
      }
    }.bind(this);

    var dropOnPlacemat = function dropOnPlacemat(ev) {
      ev.preventDefault();
      var randomClass = ev.dataTransfer.getData("randomClass");
      var elem = document.getElementsByClassName(randomClass)[0];
      elem.classList.remove(randomClass);
      this.moveTile(this.contents[elem.tileIndex]);
    }.bind(this);

    if (this.interactive) {
      this.handToRender.addEventListener("dragover", allowDrop);
      this.handToRender.addEventListener("dragenter", allowDrop);
      this.handToRender.addEventListener("drop", dropOnHand);

      if (this.tilePlacemat) {
        this.tilePlacemat.addEventListener("dragover", allowDrop);
        this.tilePlacemat.addEventListener("dragenter", allowDrop);
        this.tilePlacemat.addEventListener("drop", dropOnPlacemat);
        this.tilePlacemat.addEventListener("dragover", function () {
          this.style.backgroundColor = "lightblue";
        });
        this.tilePlacemat.addEventListener("dragleave", function () {
          this.style.backgroundColor = "";
        });
        this.tilePlacemat.addEventListener("drop", function () {
          this.style.backgroundColor = "";
        });
      }
    }

    this.removeMatchingTilesFromHand = function removeMatchingTilesFromHand(obj) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var simulated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!obj instanceof Tile) {
        throw "You must send a tile. ";
      }

      return this.removeTilesFromHand(new Array(amount).fill(obj), simulated);
    }.bind(this);

    this.removeTilesFromHand = function removeTilesFromHand(tiles) {
      var _this2 = this;

      var simulated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (tiles instanceof Sequence || tiles instanceof TileContainer) {
        tiles = tiles.tiles;
      }

      if (tiles instanceof Tile) {
        tiles = [tiles];
      } else if (!tiles instanceof Array) {
        throw "Must send a Sequence, Tile, or Array. ";
      } //We will verify that the tiles CAN be removed before removing them.


      var indexes = [];
      tiles.forEach(function (tile, index) {
        if (!(tile instanceof Tile)) {
          throw "Your Sequence or Array contains non-tiles. ";
        }

        for (var i = _this2.contents.length - 1; i >= 0; i--) {
          if (tile.matches(_this2.contents[i]) && !indexes.includes(i)) {
            indexes[index] = i;
            return;
          }
        }
      });
      var allDefined = true;

      for (var i = 0; i < tiles.length; i++) {
        if (indexes[i] === undefined) {
          allDefined = false;
        }
      }

      if (allDefined) {
        if (simulated) {
          return true;
        } //Remove the item the farthest back in the hand to avoid position shifting.


        indexes.sort(function (a, b) {
          return b - a;
        }).forEach(function (index) {
          _this2.contents.splice(index, 1);
        });
        return true;
      } else {
        return false;
      }
    }.bind(this);

    this.renderPlacemat = function (classForFirst) {
      var _classForFirst,
          _this$tilePlacemat$fi,
          _this3 = this;

      classForFirst = (_classForFirst = classForFirst) !== null && _classForFirst !== void 0 ? _classForFirst : (_this$tilePlacemat$fi = this.tilePlacemat.firstChild) === null || _this$tilePlacemat$fi === void 0 ? void 0 : _this$tilePlacemat$fi.className; //Don't clear existing class unless classForFirst is ""

      while (this.tilePlacemat.firstChild) {
        this.tilePlacemat.firstChild.remove();
      } //Delete everything currently rendered in the hand.


      var _loop = function _loop(i) {
        var tile = _this3.inPlacemat[i];
        var elem = document.createElement("img");

        _this3.tilePlacemat.appendChild(elem);

        if (i === 0 && classForFirst) {
          elem.className = classForFirst;
        }

        if (tile) {
          var _stateManager2, _stateManager2$lastSt, _stateManager2$lastSt2, _stateManager2$lastSt3;

          elem.src = tile.imageUrl;
          elem.title = tile.getTileName((_stateManager2 = stateManager) === null || _stateManager2 === void 0 ? void 0 : (_stateManager2$lastSt = _stateManager2.lastState) === null || _stateManager2$lastSt === void 0 ? void 0 : (_stateManager2$lastSt2 = _stateManager2$lastSt.message) === null || _stateManager2$lastSt2 === void 0 ? void 0 : (_stateManager2$lastSt3 = _stateManager2$lastSt2.settings) === null || _stateManager2$lastSt3 === void 0 ? void 0 : _stateManager2$lastSt3.gameStyle);
          elem.draggable = true; //Is this even neccessary? It wasn't set earlier, yet it was working fine. Do browsers just assume or something?
          //Both work. Using i is faster and simpler.

          elem.placematIndex = i; //this.inPlacemat.findIndex((item) => {return item === tile})

          elem.addEventListener("dragstart", dragstart);
          elem.addEventListener("click", function () {
            this.moveTile(tile); //Closure.
          }.bind(_this3));
        } else {
          elem.src = "assets/tiles/tile-outline.png";
        }
      };

      for (var i = 0; i < this.placematLength; i++) {
        _loop(i);
      }
    }.bind(this);

    this.setEvictingThrownTile = function (tile) {
      //Clear the other evicting tile, even if it's position has moved due to some glitch or user hacking.
      for (var i = this.inPlacemat.length - 1; i >= 0; i--) {
        var item = this.inPlacemat[i];

        if (item.evicting) {
          this.inPlacemat.splice(i, 1);
        }
      }

      if (tile) {
        if (this.inPlacemat.length >= this.placematLength) {
          this.contents.push(this.inPlacemat.pop());
        }

        this.inPlacemat.unshift(tile);
        tile.evicting = true;
      }
    }.bind(this);

    this.renderTiles = function (displayElevated) {
      if (!this.handToRender) {
        throw "Unable to render hand. You must pass config.handToRender to the constructor. ";
      }

      while (this.handToRender.firstChild) {
        this.handToRender.firstChild.remove();
      } //Delete everything currently rendered in the hand.


      if (this.handForExposed) {
        while (this.handForExposed.firstChild) {
          this.handForExposed.firstChild.remove();
        } //Delete everything currently rendered in the hand.

      }

      if (typeof displayElevated === "string") {
        displayElevated = Tile.fromJSON(displayElevated);
      }

      var unexposedTiles = [];
      var exposedTiles = [];

      for (var i = 0; i < this.contents.length; i++) {
        var item = this.contents[i];

        if (item instanceof Tile) {
          unexposedTiles.push(item);
        } else if (item instanceof Pretty) {
          exposedTiles.push(item);
        } else if (item instanceof Match || item instanceof Sequence) {
          var items = item.tiles;

          if (item instanceof Match) {
            if (item.amount === 4) {
              //kong. Flip 1 tile.
              items[0].faceDown = true;
              items[0] = Tile.fromJSON(items[0].toJSON()); //Regenerate tile. This fixes the image url and name.
            }
          }

          if (item.exposed) {
            exposedTiles.push(items);
          } else {
            if (item instanceof Match && item.amount === 4) {
              //In hand kong. Expose with 2 flipped tiles. (One already flipped)
              items[3].faceDown = true;
              items[3] = Tile.fromJSON(items[3].toJSON()); //Regenerate tile. This fixes the image url and name.

              exposedTiles.push(items);
            } else {
              console.log(items);
              unexposedTiles.push(items);
            }
          }
        } else if (item instanceof TileContainer) {
          exposedTiles.push(item.tiles);
        } else {
          console.error("Unknown item " + item);
        }
      }

      var drawTiles = function drawTiles(tiles, type) {
        var applyColorShading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var drawTile = function (tile, indexInGroup) {
          var _stateManager3, _stateManager3$lastSt, _stateManager3$lastSt2, _stateManager3$lastSt3;

          var elem = document.createElement("img");
          elem.src = tile.imageUrl;
          elem.title = tile.getTileName((_stateManager3 = stateManager) === null || _stateManager3 === void 0 ? void 0 : (_stateManager3$lastSt = _stateManager3.lastState) === null || _stateManager3$lastSt === void 0 ? void 0 : (_stateManager3$lastSt2 = _stateManager3$lastSt.message) === null || _stateManager3$lastSt2 === void 0 ? void 0 : (_stateManager3$lastSt3 = _stateManager3$lastSt2.settings) === null || _stateManager3$lastSt3 === void 0 ? void 0 : _stateManager3$lastSt3.gameStyle); //Group tiles in a match together.

          if (indexInGroup && indexInGroup !== 0) {
            elem.style.setProperty("--negativeMarginMultiplier", 2);
          } else if (indexInGroup === 0) {
            elem.style.setProperty("--negativeMarginMultiplier", 0);
          }

          if (type === "exposed" && this.handForExposed) {
            this.handForExposed.appendChild(elem);
          } else if (type === "exposed") {
            if (applyColorShading) {
              //There is no hand specifically for exposed tiles. We'll apply some style to make it clear this was exposed.
              elem.style.filter = "brightness(1.2)";
            }

            this.handToRender.appendChild(elem);
          } else if (type === "unexposed") {
            if (!this.handForExposed && applyColorShading) {
              //There is no hand for exposed tiles, let's make it clear this is unexposed
              elem.style.filter = "brightness(0.8)";
            }

            if (this.interactive) {
              if (displayElevated && tile.matches(displayElevated)) {
                displayElevated = undefined;
                elem.classList.add("animateTile");
              }

              elem.draggable = true;
              elem.addEventListener("click", function () {
                this.moveTile(tile); //Closure.
              }.bind(this));
              elem.addEventListener("dragstart", dragstart);
              elem.tileIndex = this.contents.findIndex(function (item) {
                return item === tile;
              });
            }

            this.handToRender.appendChild(elem);
          }
        }.bind(this);

        for (var _i = 0; _i < tiles.length; _i++) {
          var tile = tiles[_i];

          if (tile instanceof Array) {
            for (var j = 0; j < tile.length; j++) {
              drawTile(tile[j], j);
            }
          } else if (type === "unexposed" && _i === 0) {
            drawTile(tile, 0); //Add extra margin in front of the first unexposed tile.
          } else {
            drawTile(tile);
          }
        } //Note: If the window is resized, tiles will not adjust until the hand is redrawn.


        function resizeHandTiles(hand) {
          if (hand.children.length > 14) {
            //Downscale tiles to fit.
            var baseVh = parseFloat(document.documentElement.style.getPropertyValue("--vh")); //Pixels.

            baseVh /= hand.children.length / 14;
            var baseVw = parseFloat(document.documentElement.style.getPropertyValue("--vw")); //Pixels.

            baseVw /= hand.children.length / 14;
            hand.children.forEach(function (child) {
              child.style.setProperty("--vh", baseVh + "px");
              child.style.setProperty("--vw", baseVw + "px");
            });
          }
        }

        resizeHandTiles(this.handToRender);

        if (this.handForExposed) {
          resizeHandTiles(this.handForExposed);
        }
      }.bind(this);

      var applyColorShading = false; //If there are any tiles in unexposedTiles that are not face down, or there are no unexposed tiles.

      if (unexposedTiles.some(function (tile) {
        return !tile.faceDown;
      }) || unexposedTiles.length === 0) {
        applyColorShading = true;
      }

      drawTiles(exposedTiles, "exposed", applyColorShading);
      drawTiles(unexposedTiles, "unexposed", applyColorShading);

      if (this.tilePlacemat) {
        this.renderPlacemat();
      }
    }.bind(this);

    this.getStringContents = function () {
      var prop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "contents";
      //Can also pass "inPlacemat" for placemat contents.
      return this[prop].map(function (item) {
        return item.toJSON();
      });
    }.bind(this);

    this.toJSON = function () {
      return JSON.stringify({
        wind: this.wind,
        contents: this.contents
      });
    }.bind(this);
  }

  _createClass(Hand, null, [{
    key: "getTileValue",
    value: function getTileValue(tile) {
      //The greater the value, the further to the right we place the tile.
      var tileValue = 0;
      tileValue += 100 * ["pretty", "flower", "season", "circle", "bamboo", "character", "wind", "dragon", "joker"].findIndex(function (suit) {
        return tile.type === suit;
      });

      if (typeof tile.value === "number") {
        tileValue += tile.value;
      } else if (tile.type === "wind") {
        tileValue += 10 * ["north", "east", "south", "west"].findIndex(function (value) {
          return tile.value === value;
        });
      } else if (tile.type === "dragon") {
        tileValue += 10 * ["red", "green", "white"].findIndex(function (value) {
          return tile.value === value;
        });
      } else if (!tile.faceDown && tile.type !== "joker") {
        console.error("Couldn't fully calculate value for " + tile);
      }

      return tileValue;
    }
  }, {
    key: "sortTiles",
    value: function sortTiles(tiles) {
      return tiles.sort(function (tile1, tile2) {
        return Hand.getTileValue(tile1) - Hand.getTileValue(tile2);
      });
    }
  }, {
    key: "convertStringsToTiles",
    value: function convertStringsToTiles(arr) {
      //arr is an array, with the stringified contents of the hand.
      var contents = arr.map(function (itemStr) {
        var obj = JSON.parse(itemStr);

        if (obj.class === "Pretty") {
          return Pretty.fromJSON(itemStr);
        } else if (obj.class === "Tile") {
          return Tile.fromJSON(itemStr);
        } else if (obj.class === "Sequence") {
          return Sequence.fromJSON(itemStr);
        } else if (obj.class === "TileContainer") {
          return TileContainer.fromJSON(itemStr);
        } else if (obj.class === "Match") {
          return Match.fromJSON(itemStr);
        } else {
          throw "Unable to identify itemString " + itemStr;
        }
      });
      return contents;
    }
  }, {
    key: "fromString",
    value: function fromString(str) {
      //Hand.fromString is only meant to be used on the server side. Therefore, it will not attempt to carry over any functionality that would be client side.
      var obj = JSON.parse(str);
      var wind = obj.wind;
      var hand = new Hand({
        wind: obj.wind
      });
      hand.contents = Hand.convertStringsToTiles(obj.contents);
      return hand;
    }
  }]);

  return Hand;
}();

module.exports = Hand;

/***/ }),

/***/ 9064:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(4747);

__webpack_require__(6699);

__webpack_require__(7941);

var Sequence = __webpack_require__(7793);

var Pretty = __webpack_require__(4810);

function getClearHandDoubles() {
  var suits = {};
  var honors = false;
  var onesAndNines = true;
  this.contents.forEach(function (item) {
    if (item instanceof Sequence) {
      suits[item.tiles[0].type] = true;
      onesAndNines = false;
    } else if (!(item instanceof Pretty)) {
      suits[item.type] = true;

      if (!["wind", "dragon"].includes(item.type) && item.value !== 1 && item.value !== 9) {
        onesAndNines = false;
      }
    }
  });

  if (suits["wind"] || suits["dragon"]) {
    delete suits["wind"];
    delete suits["dragon"];
    honors = true;
  }

  suits = Object.keys(suits).length;

  if (suits === 0) {
    //All honors
    return 3;
  } else if (suits === 1 && !honors) {
    return 3;
  } else if (suits === 1 && honors) {
    return 1;
  } else if (onesAndNines && !honors) {
    return 3;
  } else if (onesAndNines && honors) {
    return 1;
  }

  return 0;
}

module.exports = getClearHandDoubles;

/***/ }),

/***/ 6527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

__webpack_require__(4747);

__webpack_require__(3290);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(1539);

__webpack_require__(2165);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

var Sequence = __webpack_require__(7793);

var Pretty = __webpack_require__(4810);

var Wall = __webpack_require__(6212);

var Match = __webpack_require__(9458);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

function isCalling(discardPile, maximumSequences) {
  var _this = this;

  //This determines if, from the player's point of view, they are calling.
  //We don't access any information that they do not have access to in making this determination.
  var allTilesHand = new Hand();
  allTilesHand.contents = Wall.getNonPrettyTiles();
  discardPile.forEach(function (tile) {
    allTilesHand.removeMatchingTile(tile);
  }); //We don't check inPlacemat, so should be used for server side use only.
  //Remove the contents of the user's hand from allTilesHand

  this.contents.forEach(function (item) {
    if (item instanceof Tile) {
      allTilesHand.removeMatchingTile(item);
    } else if (item instanceof Sequence) {
      item.tiles.forEach(function (tile) {
        allTilesHand.removeMatchingTile(tile);
      });
    } else if (item instanceof Match) {
      new Array(item.amount).fill().forEach(function () {
        allTilesHand.removeMatchingTile(item.getComponentTile());
      });
    }
  });

  var _loop = function _loop() {
    var tile = allTilesHand.contents[0];

    while (allTilesHand.removeMatchingTile(tile)) {} //Remove all matching tiles from allTilesHand so that we don't call isMahjong with the same tile several times.
    //isMahjong can be rather slow when called repeatedly. Let's do some quick checking to confirm this tile may actually help.
    //We either need to have an existing copy of the tile, or the ability for this tile to fill a sequence.


    var passes = _this.contents.some(function (item, i) {
      return tile.matches(item);
    });

    if (!passes && !isNaN(tile.value)) {
      var arr = [,, true,,,];

      _this.contents.forEach(function (item) {
        if (item.type === tile.type && Math.abs(item.value - tile.value) <= 2) {
          arr[2 - (item.value - tile.value)] = true;
        }
      });

      if (arr[0] && arr[1] || arr[1] && arr[3] || arr[3] && arr[4]) {
        passes = true;
      }
    }

    if (!passes) {
      return "continue";
    }

    _this.add(tile);

    if (_this.isMahjong(maximumSequences)) {
      _this.remove(tile);

      return {
        v: tile
      }; //TODO: It's possible multiple tiles could make us mahjong. This is just one of them.
    }

    _this.remove(tile);
  };

  while (allTilesHand.contents.length) {
    var _ret = _loop();

    if (_ret === "continue") continue;
    if (_typeof(_ret) === "object") return _ret.v;
  }

  return false;
}

module.exports = isCalling;

/***/ }),

/***/ 5867:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

__webpack_require__(5666);

__webpack_require__(7042);

__webpack_require__(4747);

__webpack_require__(4944);

__webpack_require__(3290);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(2222);

__webpack_require__(7327);

__webpack_require__(5827);

__webpack_require__(9653);

__webpack_require__(1539);

__webpack_require__(8309);

__webpack_require__(1038);

__webpack_require__(2526);

__webpack_require__(1817);

__webpack_require__(2165);

var Sequence = __webpack_require__(7793);

var Pretty = __webpack_require__(4810);

var Wall = __webpack_require__(6212);

var Match = __webpack_require__(9458);

var Tile = __webpack_require__(2946);

var Hand = __webpack_require__(2169);

function isMahjong() {
  var _marked2 = /*#__PURE__*/regeneratorRuntime.mark(generateCombinations);

  var maximumSequences = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
  //4 sequences is unlimited.
  //Returns 2 for mahjong, and 0 for not mahjong.
  //If the hand is not currently committed to mahjong, but is mahjong, a hand containing the organization resulting in mahjong will be returned.
  var pongOrKong = 0;
  var pairs = 0;
  var sequences = 0;
  var remainingTiles = [];
  var initialTiles = [];

  for (var i = 0; i < this.contents.length; i++) {
    var match = this.contents[i];

    if (match.isPongOrKong) {
      pongOrKong++;
      initialTiles.push(match);
    } else if (match.isPair) {
      pairs++;
      initialTiles.push(match);
    } else if (match.isSequence) {
      sequences++;
      initialTiles.push(match);
    } else if (match instanceof Pretty) {
      initialTiles.push(match);
    } else {
      remainingTiles.push(match);
    }
  }

  if (pairs === 1) {
    if (Math.min(sequences, maximumSequences) + pongOrKong === 4) {
      return 2;
    }
  } //Now we need to go through our remaining tiles.


  var allTiles = Hand.sortTiles(Wall.getNonPrettyTiles(1));
  var possibleMatches = [];
  var possibleSequences = [];
  var testingHand = new Hand();
  testingHand.contents = remainingTiles.slice(0);
  allTiles.forEach(function (tile) {
    if (testingHand.removeMatchingTilesFromHand(tile, 3, true)) {
      possibleMatches.push(tile);
    }
  }); //We might be able to have multiple copies of the same sequence.
  //TODO: This has potential to be very slow.

  allTiles.forEach(function (tile, index) {
    if (!Sequence.isValidSequence(allTiles.slice(index, index + 3))) {
      return;
    }

    var copies = 0;
    var tiles = allTiles.slice(index, index + 3);

    while (copies < maximumSequences) {
      var testTiles = Array(copies + 1).fill(tiles).flat();

      if (testingHand.removeTilesFromHand(testTiles, true)) {
        copies++;
      } else {
        break;
      }
    }

    for (var _i = 0; _i < copies; _i++) {
      possibleSequences.push(new Sequence({
        exposed: false,
        tiles: tiles //Is it a problem using the same referenced tiles? And even further, do we need to create seperate sequence objects? I think not.

      }));
    }
  }); //https://stackoverflow.com/questions/5752002/find-all-possible-subset-combos-in-an-array/39092843#39092843

  function generateCombinations(arr, size) {
    var _marked, doGenerateCombinations;

    return regeneratorRuntime.wrap(function generateCombinations$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            doGenerateCombinations = function _doGenerateCombinatio(offset, combo) {
              var _i2;

              return regeneratorRuntime.wrap(function doGenerateCombinations$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!(combo.length == size)) {
                        _context.next = 5;
                        break;
                      }

                      _context.next = 3;
                      return combo;

                    case 3:
                      _context.next = 11;
                      break;

                    case 5:
                      _i2 = offset;

                    case 6:
                      if (!(_i2 < arr.length)) {
                        _context.next = 11;
                        break;
                      }

                      return _context.delegateYield(doGenerateCombinations(_i2 + 1, combo.concat(arr[_i2])), "t0", 8);

                    case 8:
                      _i2++;
                      _context.next = 6;
                      break;

                    case 11:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _marked);
            };

            _marked = /*#__PURE__*/regeneratorRuntime.mark(doGenerateCombinations);
            return _context2.delegateYield(doGenerateCombinations(0, []), "t0", 3);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked2);
  }

  var combinations = [];
  var allPossibilities = possibleMatches;
  var neededPongEquivs = 4;

  if (maximumSequences > sequences) {
    //If we are at the sequence limit, there's no need to add the sequences to the possibilities.
    allPossibilities = allPossibilities.concat(possibleSequences);
    neededPongEquivs -= sequences;
  } else {
    neededPongEquivs -= Math.min(sequences, 1);
  }

  neededPongEquivs -= pongOrKong;

  var _iterator = _createForOfIteratorHelper(generateCombinations(allPossibilities, neededPongEquivs)),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _combo = _step.value;

      //Remove all combos that result in too many sequences, or that are obviously impossible.
      var sequenceCount = _combo.reduce(function (total, value) {
        return total + Number(value instanceof Sequence);
      }, 0);

      var matchCount = neededPongEquivs - sequenceCount;
      sequenceCount += sequences;

      if (4 - pongOrKong - matchCount > Math.min(maximumSequences, sequenceCount)) {
        continue;
      }

      combinations.push(_combo);
    } //TODO: Now that we support stacked sequences, we could have multiple valid winning hands. We should handle this, and return all valid hands.

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  combos: for (var _i3 = 0; _i3 < combinations.length; _i3++) {
    var combo = combinations[_i3];
    var localTestHand = new Hand();
    localTestHand.contents = testingHand.contents.slice(0);

    for (var _i4 = 0; _i4 < combo.length; _i4++) {
      var item = combo[_i4];

      if (item instanceof Tile) {
        if (!localTestHand.removeMatchingTilesFromHand(item, 3)) {
          continue combos; //Continue outer loop
        }

        localTestHand.add(new Match({
          type: item.type,
          value: item.value,
          exposed: false,
          amount: 3
        }));
      } else if (item instanceof Sequence) {
        if (!localTestHand.removeTilesFromHand(item)) {
          continue combos; //Continue outer loop
        }

        localTestHand.add(item);
      }
    } //Check for a pair


    var tile = localTestHand.contents.filter(function (item) {
      return item instanceof Tile;
    })[0];

    if (pairs === 0 && !localTestHand.removeMatchingTilesFromHand(tile, 2, true)) {
      continue;
    } else {
      if (pairs === 0) {
        localTestHand.add(new Match({
          type: tile.type,
          value: tile.value,
          exposed: false,
          amount: 2
        }));
        localTestHand.removeMatchingTilesFromHand(tile, 2);
      }

      localTestHand.contents = localTestHand.contents.concat(initialTiles.slice(0));
      return localTestHand;
    }
  }

  return 0;
}

module.exports = isMahjong;

/***/ }),

/***/ 839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(7042);

var Match = __webpack_require__(9458);

var Tile = __webpack_require__(2946);

function score() {
  var _this = this;

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var doubles = 0;
  var score = 0;
  var sequences = false;
  var oldContents = this.contents.slice(0);

  var _loop = function _loop(_i) {
    var match = _this.contents[_i]; //If we have empty tiles laying around, let's try and create the largest matches possible, as we clearly aren't mahjong.

    if (match instanceof Tile) {
      [4, 3, 2].forEach(function (amount) {
        if (!(match instanceof Tile)) {
          i = _i;
          return;
        } //Already matched.


        if (_this.removeMatchingTilesFromHand(match, amount)) {
          _i--; //Counteract position shifting. 

          match = new Match({
            amount: amount,
            type: match.type,
            value: match.value,
            exposed: false
          });
        }
      }.bind(_this));
    }

    doubles += match.isDouble(_this.wind);
    score += match.getPoints(_this.wind);
    sequences = sequences || match.isSequence;
    i = _i;
  };

  for (var i = 0; i < this.contents.length; i++) {
    _loop(i);
  }

  if (config.isMahjong) {
    score += 20;

    if (config.drewOwnTile) {
      score += 10;
    }

    if (!sequences) {
      score += 10;
    }
  }

  this.contents = oldContents; //Reset any modifications

  doubles += this.getClearHandDoubles();
  return score * Math.pow(2, doubles);
}

module.exports = score;

/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(4747);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(6699);

__webpack_require__(2772);

__webpack_require__(7042);

__webpack_require__(2222);

var Tile = __webpack_require__(2946);

function syncContents(syncContents) {
  var addAdditionsToPlacematIfOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  //We allow the user to sort their hand by themselves, however it is possible that, due to lag or other reasons, the users hand ends up not matching the server.
  //This function will sync the contents of the users hand with contents, preserving some user ordering.
  var currentContentsStrings = [];
  var syncContentsStrings = [];
  this.contents.forEach(function (item) {
    currentContentsStrings.push(item.toJSON());
  });
  this.inPlacemat.forEach(function (item) {
    if (item.evicting) {
      return;
    }

    currentContentsStrings.push(item.toJSON());
  });
  syncContents.forEach(function (item) {
    syncContentsStrings.push(item.toJSON());
  }); //Let's go through both arrays, and see what needs to change.
  //We'll stringify, because these are not identical instances, and therefore == will not work.

  for (var i = 0; i < currentContentsStrings.length; i++) {
    var str = currentContentsStrings[i];

    if (str && syncContentsStrings.includes(str)) {
      currentContentsStrings[i] = null;
      syncContentsStrings[syncContentsStrings.indexOf(str)] = null;
    }
  } //Save tempContents now, because we add items to the array later, and they mess up ordering otherwise.


  var tempContents = this.contents.slice(0); //We are cloning the array, however the referenced objects remain the same. This prevents us from having to adjust indexes for items when we remove other items.

  if (this.inPlacemat[0] && this.inPlacemat[0].evicting) {
    tempContents = tempContents.concat(this.inPlacemat.slice(1));
  } else {
    tempContents = tempContents.concat(this.inPlacemat.slice(0));
  } //Everything that matches is now nulled out, so we remove everything remaining in currentContentsStrings, and add everything remaining in syncContentsStrings.


  for (var _i = 0; _i < currentContentsStrings.length; _i++) {
    var item = currentContentsStrings[_i];

    if (item) {
      this.remove(tempContents[_i]);
    }
  } //We run this after removal so that the placemat can be cleared out for addAdditionsToPlacematIfOpen


  for (var _i2 = 0; _i2 < syncContentsStrings.length; _i2++) {
    var _item = syncContentsStrings[_i2];

    if (_item) {
      if (addAdditionsToPlacematIfOpen && this.inPlacemat.length < 3 && syncContents[_i2] instanceof Tile) {
        this.inPlacemat.push(syncContents[_i2]);
      } else {
        this.add(syncContents[_i2]);
      }
    }
  }
}

module.exports = syncContents;

/***/ }),

/***/ 9458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(6699);

__webpack_require__(1249);

__webpack_require__(3290);

__webpack_require__(5735);

__webpack_require__(3753);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(2946);

var Match = /*#__PURE__*/function () {
  "use strict";

  function Match() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Match);

    if (config.exposed == undefined) {
      throw "Must specify either true or false for config.exposed. ";
    }

    if (config.amount < 2 || config.amount > 4) {
      throw "config.mount must be either 2, 3, or 4. ";
    }

    this.type = config.type;
    this.value = config.value;
    this.amount = config.amount;
    this.exposed = config.exposed;

    this.getTileName = function () {
      var _this$getComponentTil;

      return (_this$getComponentTil = this.getComponentTile()).getTileName.apply(_this$getComponentTil, arguments);
    }.bind(this);

    this.getComponentTile = function () {
      return new Tile({
        type: this.type,
        value: this.value
      });
    };

    this.getPoints = function (userWind) {
      var points = 0;

      if (["bamboo", "character", "circle"].includes(this.type)) {
        points = 2;

        if (this.value === 1 || this.value === 9) {
          points *= 2;

          if (this.amount === 2) {
            return 2;
          } //This is a pair. It's worth 2 points

        }

        if (this.amount === 2) {
          return 0;
        } //Worthless pair

      } else {
        points = 4; //Either wind or dragon. 4 points for pong.

        if (this.amount === 2) {
          if (this.type === "wind" && this.value !== userWind) {
            return 0;
          } //Not own wind. Worthless pair.


          return 2; //2 points for pair.
        }
      }

      if (this.amount === 4) {
        points *= 4;
      } //Kongs worth 4 times as much as pongs.


      if (!this.exposed) {
        points *= 2;
      } //In hand worth 4 times as much.


      return points;
    };

    this.isDouble = function (userWind) {
      var assumeNotPair = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.amount === 2 && !assumeNotPair) {
        return false;
      } //Pairs never give doubles.


      if (this.type === "dragon") {
        return true;
      }

      if (this.type === "wind" && this.value === userWind) {
        return true;
      }

      return false;
    };

    Object.defineProperty(this, "tiles", {
      get: function getTiles() {
        var _this = this;

        return new Array(this.amount).fill().map(function () {
          return _this.getComponentTile();
        }.bind(this));
      }.bind(this)
    });
    Object.defineProperty(this, "isPair", {
      get: function isPair() {
        if (this.amount === 2) {
          return true;
        }

        return false;
      }
    });
    Object.defineProperty(this, "isPongOrKong", {
      get: function isPongOrKong() {
        if (this.amount >= 3) {
          return true;
        }

        return false;
      }
    });

    this.toJSON = function () {
      var obj = {};
      obj.class = "Match";
      obj.type = this.type;
      obj.value = this.value;
      obj.amount = this.amount;
      obj.exposed = this.exposed;
      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
  }

  _createClass(Match, null, [{
    key: "isValidMatch",
    value: function isValidMatch(tiles) {
      //Confirm that the tiles all match.
      //Note that if two tiles are equal, that means they are the same tile, just referenced twice. That is not a valid match, however we currently do not check for that.
      for (var i = 0; i < tiles.length; i++) {
        if (!tiles[0].matches(tiles[i])) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Match") {
        throw "String was not created by Match.toJSON()";
      }

      return new Match(obj);
    }
  }]);

  return Match;
}();

module.exports = Match;

/***/ }),

/***/ 4376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(9600);

__webpack_require__(3123);

__webpack_require__(4916);

__webpack_require__(8674);

__webpack_require__(1539);

__webpack_require__(2222);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notification = function Notification(errorText, messageText) {
  "use strict";

  _classCallCheck(this, Notification);

  var cover = document.createElement("div");
  cover.id = "errorPopupCover";
  cover.style.display = "none";
  document.body.appendChild(cover);
  var popup = document.createElement("div");
  popup.id = "errorPopup";
  cover.appendChild(popup);
  var error = document.createElement("p");
  error.innerHTML = errorText;
  error.id = "errorText";
  popup.appendChild(error);

  if (typeof messageText === "string") {
    var message = document.createElement("p");
    message.innerHTML = messageText.split("\n").join("<br>");
    message.id = "messageText";
    popup.appendChild(message);
  } else {
    popup.appendChild(messageText); //Allow appending divs to this.

    messageText.id = "messageText";
  }

  var dismissButton = document.createElement("button");
  dismissButton.id = "dismissButton";
  dismissButton.innerHTML = "Dismiss";
  popup.appendChild(dismissButton);

  var dismiss = function dismiss(ev) {
    if (this.ondismissed) {
      this.ondismissed();
    }

    cover.remove();
  }.bind(this); //Prevent people from accidentally closing the message before they can read it.


  setTimeout(function () {
    dismissButton.addEventListener("click", dismiss);
    cover.addEventListener("click", function (event) {
      if (event.target === cover) {
        dismiss();
      }
    });
  }, 500);

  this.show = function () {
    cover.style.display = "";
  };

  this.dismiss = dismiss;
};

var previousMessagePromise = new Promise(function (resolve) {
  resolve();
});
var counters = {
  messages: 0,
  optionalMessages: 0
};

var BlocklessAlert = /*#__PURE__*/function () {
  "use strict";

  function BlocklessAlert(messageText) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3200;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, BlocklessAlert);

    var cover = document.createElement("div");
    cover.classList.add("blocklessAlertCover");
    cover.style.display = "none";
    document.body.appendChild(cover);
    var message = document.createElement("p");
    message.innerHTML = messageText;
    cover.appendChild(message);
    var onStart = previousMessagePromise;
    previousMessagePromise = new Promise(function (resolve) {
      counters.messages++;
      counters.optionalMessages += !!config.optional;

      function undoCounters() {
        var optionalTriggered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        counters.messages--;
        counters.optionalMessages -= !!config.optional - optionalTriggered;
      }

      previousMessagePromise.then(function () {
        var triggerLevel = 2; //More than 2, so 3 optional messages waiting. Once this threshold is exceeded once,
        //we don't display more optional messages.

        if (counters.optionalMessages > triggerLevel && config.optional) {
          //Skip
          console.log("Skipping optional message due to time. ");
          undoCounters(true);
          return resolve();
        }

        console.log("".concat(counters.messages, " messages remaining to be posted (").concat(counters.optionalMessages, " optional)")); //Speed up alerts to eat through queue - if maxCounter exceeds triggerLevel, message volume is reduced, so we stop factoring in maxCounter

        var newDuration = duration / Math.min(2.5, Math.max(1, Math.pow(counters, 0.7)) || 1); //2.5x speedup max.

        console.log("Adjusting duration from ".concat(duration, " to ").concat(newDuration));
        duration = newDuration;
        cover.style.animation = "fadeInAndOut " + duration + "ms ease-in";
        cover.style.display = "";
        setTimeout(function () {
          cover.remove();
          undoCounters();
          resolve();
        }, duration);
      });
    });
    var onEnd = previousMessagePromise;
    return {
      onStart: onStart,
      onEnd: onEnd
    };
  }

  return BlocklessAlert;
}();

var MessageBar = function MessageBar(text) {
  "use strict";

  _classCallCheck(this, MessageBar);

  var bar = document.createElement("div");
  bar.id = "notificationBar";
  var textHolder = document.createElement("p");
  textHolder.innerHTML = text;
  bar.appendChild(textHolder);

  this.show = function (duration) {
    document.body.appendChild(bar);
    setTimeout(function () {
      bar.remove();
    }, duration);
  };

  this.dismiss = function () {
    bar.remove();
  };
};

module.exports = {
  Notification: Notification,
  MessageBar: MessageBar,
  BlocklessAlert: BlocklessAlert
};

/***/ }),

/***/ 4810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(6699);

__webpack_require__(5735);

__webpack_require__(3753);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pretty = /*#__PURE__*/function () {
  "use strict";

  function Pretty() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Pretty);

    if (!["season", "flower"].includes(config.seasonOrFlower)) {
      throw "config.seasorOrFlower must either be 'season' or 'flower'";
    }

    this.type = "pretty";
    this.value = config.value;
    this.seasonOrFlower = config.seasonOrFlower;
    this.exposed = true;

    this.getTileName = function () {
      return "Pretty";
    };

    var numberToWind = ["east", "south", "west", "north"];

    this.isDouble = function (userWind) {
      if (userWind === numberToWind[this.value - 1]) {
        return true;
      }

      return false;
    };

    this.getPoints = function () {
      return 4;
    };

    this.imageUrl = "assets/tiles/" + config.seasonOrFlower + "s" + "/" + config.value + ".png";

    this.toJSON = function () {
      var obj = {};
      obj.class = "Pretty";
      obj.value = this.value;
      obj.seasonOrFlower = this.seasonOrFlower;
      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
    this.isPongOrKong = false;
    this.isPair = false;
  }

  _createClass(Pretty, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Pretty") {
        throw "String was not created by Pretty.toJSON()";
      }

      return new Pretty(obj);
    }
  }]);

  return Pretty;
}();

module.exports = Pretty;

/***/ }),

/***/ 2342:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(285);

__webpack_require__(1539);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(7042);

__webpack_require__(3210);

__webpack_require__(2481);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(4747);

__webpack_require__(8309);

__webpack_require__(9653);

__webpack_require__(2772);

var Popups = __webpack_require__(4376);

var SettingsMenu = __webpack_require__(7537);

var QRCode = __webpack_require__(6192); //Allow the user to join and create rooms.


var roomManager = document.createElement("div");
roomManager.id = "roomManager";
document.body.appendChild(roomManager); //In order to get the "4 friends" part styled differently, we will need 3 elements for our heading.

var heading = document.createElement("div");
heading.id = "heading";
roomManager.appendChild(heading);
var mahjongHeading = document.createElement("h1");
mahjongHeading.innerHTML = "Mahjong";
mahjongHeading.id = "mahjongHeading";
heading.appendChild(mahjongHeading);
var fourFriendsHeading = document.createElement("h1");
fourFriendsHeading.innerHTML = "4 Friends";
fourFriendsHeading.id = "fourFriendsHeading";
heading.appendChild(fourFriendsHeading); //notInRoomContainer: The stuff to create or join a room.

var notInRoomContainer = document.createElement("div");
notInRoomContainer.id = "notInRoomContainer";
roomManager.appendChild(notInRoomContainer);
var roomIdInput = document.createElement("input");
roomIdInput.id = "roomIdInput";
roomIdInput.placeholder = "Enter Room Name...";
notInRoomContainer.appendChild(roomIdInput); //Put the nickname input on a new line.

notInRoomContainer.appendChild(document.createElement("br"));
var nicknameInput = document.createElement("input");
nicknameInput.id = "nicknameInput";
nicknameInput.placeholder = "Choose a Nickname...";
notInRoomContainer.appendChild(nicknameInput); //Allow query params.

var params = new URLSearchParams(window.location.hash.slice(1));

if (params.has("roomId")) {
  roomIdInput.value = params.get("roomId");
}

if (params.has("name")) {
  nicknameInput.value = params.get("name");
} //Development only - fakes native UI somewhat. Intended for automated screenshotting.


if (params.has("fakeNative")) {
  if (params.get("fakeNative") === "android") {
    window.isAndroid = true;
  } else if (params.get("fakeNative") === "ios") {
    window.Capacitor = true;
  } else {
    console.error("fakeNative set and invalid");
  }
} //The join/create room buttons.


var joinOrCreateRoom = document.createElement("div");
joinOrCreateRoom.id = "joinOrCreateRoom";
notInRoomContainer.appendChild(joinOrCreateRoom);
var joinRoom = document.createElement("button");
joinRoom.id = "joinRoom";
joinRoom.innerHTML = "Join Room";
joinRoom.addEventListener("click", function () {
  stateManager.offlineMode = false;

  if (roomIdInput.value.trim().length === 0) {
    return new Popups.Notification("Room Name Invalid", "The room name contains at least one character. Please enter it into the box labeled \"Enter Room Name\" ").show();
  }

  window.stateManager.joinRoom(roomIdInput.value.toLowerCase(), nicknameInput.value);
});
joinOrCreateRoom.appendChild(joinRoom);
var createRoom = document.createElement("button");
createRoom.id = "createRoom";
createRoom.innerHTML = "Create Room";
createRoom.addEventListener("click", function () {
  stateManager.offlineMode = false;

  if (roomIdInput.value.trim().length === 0) {
    return new Popups.Notification("Unable to Create Room", "Please pick a 1+ character long name, and enter it into the box labeled \"Enter Room Name\" ").show();
  }

  window.stateManager.createRoom(roomIdInput.value.toLowerCase(), nicknameInput.value);
});
joinOrCreateRoom.appendChild(createRoom);
joinOrCreateRoom.appendChild(document.createElement("br"));
var singlePlayerGame = document.createElement("button");
singlePlayerGame.id = "singlePlayerGame";
singlePlayerGame.innerHTML = "Single Player";
singlePlayerGame.addEventListener("click", function () {
  stateManager.offlineMode = false;
  var roomId = roomIdInput.value.trim() || "sp-" + Math.floor(Math.random() * 1e10); //We need to stop depending on randomness - collisions are possible.
  //Websockets guarantees delivery order, so we should be safe here, unless any calls error.

  var nickname = nicknameInput.value || "Player 1";
  window.stateManager.createRoom(roomId, nickname);
  window.stateManager.addBot("Bot 1");
  window.stateManager.addBot("Bot 2");
  window.stateManager.addBot("Bot 3");
});
joinOrCreateRoom.appendChild(singlePlayerGame);
var offlineSinglePlayer = document.createElement("button");
offlineSinglePlayer.id = "offlineSinglePlayer";
offlineSinglePlayer.innerHTML = "Offline (Single Player)";
offlineSinglePlayer.addEventListener("click", function () {
  stateManager.offlineMode = true; //Send to local server.

  var roomId = roomIdInput.value.trim() || "sp-" + Math.floor(Math.random() * 1e10); //We need to stop depending on randomness - collisions are possible.
  //Websockets guarantees delivery order, so we should be safe here, unless any calls error.

  var nickname = nicknameInput.value || "Player 1";
  window.stateManager.createRoom(roomId, nickname);
  window.stateManager.addBot("Bot 1");
  window.stateManager.addBot("Bot 2");
  window.stateManager.addBot("Bot 3");
});
joinOrCreateRoom.appendChild(offlineSinglePlayer);
var connectionStatus = document.createElement("p");
connectionStatus.id = "connectionStatus";
notInRoomContainer.appendChild(connectionStatus);
var dots = 1; //We could make these go a bit faster...

window.setConnectionStatus = function (_ref) {
  var connected = _ref.connected;
  connectionStatus.innerHTML = connected ? "✓ Connected to Server" : "Trying To Connect" + ".".repeat(1 + ++dots % 5);
  connectionStatus.className = connected ? "connected" : "";
  joinRoom.disabled = createRoom.disabled = singlePlayerGame.disabled = connected ? "" : "disabled";
};

window.setConnectionStatus({
  connected: false
}); //Inform user to use landscape.

if (window.Capacitor) {
  try {
    //This shouldn't be needed on iOS when build settings are set to landscape.
    //This doesn't run on the Android TWA anyways.
    window.screen.orientation.lock('landscape');
  } catch (e) {
    console.error(e);
  }
}

var screenRotationAlert = document.createElement("p");
screenRotationAlert.id = "screenRotationAlert";
screenRotationAlert.innerHTML = "Rotating your screen to Landscape mode is recommended. ";
notInRoomContainer.appendChild(screenRotationAlert);

function setScreenRotationAlert(event) {
  var _window$screen, _window$screen$orient;

  var orientation = (_window$screen = window.screen) === null || _window$screen === void 0 ? void 0 : (_window$screen$orient = _window$screen.orientation) === null || _window$screen$orient === void 0 ? void 0 : _window$screen$orient.type; //Window.innerWidth is returning the wrong value in simulator. May not be an issue on actual devices, but screen.width works fine.

  if ((orientation ? orientation.includes("portrait") : Math.abs(window.orientation) !== 90) && //Support iOS window.orientation
  screen.width < 900) {
    screenRotationAlert.style.display = "";
  } else {
    screenRotationAlert.style.display = "none";
  }
}

window.addEventListener("orientationchange", setScreenRotationAlert);
setScreenRotationAlert();
var inRoomContainer = document.createElement("div");
inRoomContainer.id = "inRoomContainer";
inRoomContainer.style.display = "none";
roomManager.appendChild(inRoomContainer);
var currentRoom = document.createElement("h2");
currentRoom.id = "currentRoom";
inRoomContainer.appendChild(currentRoom);
var playerCount = document.createElement("h2");
playerCount.id = "playerCount";
inRoomContainer.appendChild(playerCount);
var playerView = document.createElement("div");
playerView.id = "playerView";
inRoomContainer.appendChild(playerView);
var leaveRoomButton = document.createElement("button");
leaveRoomButton.innerHTML = "Leave Room";
leaveRoomButton.id = "leaveRoomButton";
inRoomContainer.appendChild(leaveRoomButton);
leaveRoomButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to leave this room?")) {
    window.stateManager.leaveRoom(window.stateManager.roomId);
  }
});
var closeRoomButton = document.createElement("button");
closeRoomButton.innerHTML = "Close Room";
closeRoomButton.id = "closeRoomButton";
closeRoomButton.style.display = "none";
inRoomContainer.appendChild(closeRoomButton);
closeRoomButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to close this room?")) {
    window.stateManager.closeRoom(window.stateManager.roomId);
  }
});
var startGameButton = document.createElement("button");
startGameButton.innerHTML = "Start Game";
startGameButton.id = "startGameButton";
startGameButton.style.display = "none";
inRoomContainer.appendChild(startGameButton);
var gameSettings;
startGameButton.addEventListener("click", function () {
  window.stateManager.startGame(gameSettings.getChoices());
});
var addBotButton = document.createElement("button");
addBotButton.innerHTML = "Add Bot";
addBotButton.id = "addBotButton";
addBotButton.style.display = "none";
inRoomContainer.appendChild(addBotButton);
addBotButton.addEventListener("click", function () {
  var name = prompt("Please enter a name for the bot: ");
  window.stateManager.addBot(name);
});
var gameSettingsElem = document.createElement("div");
gameSettingsElem.id = "gameSettingsElem";
inRoomContainer.appendChild(gameSettingsElem);
var inviteYourFriendsElem = document.createElement("div");
inviteYourFriendsElem.id = "inviteYourFriendsElem";
inRoomContainer.appendChild(inviteYourFriendsElem);
var inviteYourFriendsDiv = document.createElement("div");
inviteYourFriendsDiv.id = "inviteYourFriendsDiv";
inviteYourFriendsElem.appendChild(inviteYourFriendsDiv);
var inviteYourFriendsHeader = document.createElement("h2");
inviteYourFriendsHeader.innerHTML = "Invite Players to Join This Game!";
inviteYourFriendsDiv.appendChild(inviteYourFriendsHeader);
var joinRoomLinkElem = document.createElement("p");
joinRoomLinkElem.id = "joinRoomLinkElem";
joinRoomLinkElem.innerHTML = "Share the link: <br>";
var joinRoomLink = document.createElement("a");
joinRoomLink.target = "_blank";
joinRoomLinkElem.appendChild(joinRoomLink);
inviteYourFriendsDiv.appendChild(joinRoomLinkElem);
var QRImageElement = document.createElement("img");
QRImageElement.id = "QRImageElement";
inviteYourFriendsElem.appendChild(QRImageElement); //Create link to tutorial.

var tutorial = document.createElement("a");
tutorial.target = "_blank";
tutorial.href = "https://drive.google.com/file/d/1aGyekkldVouVY2Hy7SXTTvhS7I5X6o8O/view";
tutorial.id = "tutorialLink";
tutorial.innerHTML = "Mahjong 4 Friends Tutorial";
roomManager.appendChild(tutorial);
roomManager.appendChild(document.createElement("br")); //Create link to tutorial.

var documentation = document.createElement("a");
documentation.target = "_blank";
documentation.href = "https://docs.google.com/document/d/1sSGxlRHMkWYHjYhxJTLvHoFsVPAgSs7DFRpsZLmgIvc/edit#heading=h.t7shfpx0qwex";
documentation.id = "documentationLink";
documentation.innerHTML = "See Full Documentation";
roomManager.appendChild(documentation);
var supportInfo = document.createElement("p");
supportInfo.id = "supportInfo";
supportInfo.innerHTML = "Questions, Comments, or Concerns? Contact <a href='mailto:support@mahjong4friends.com'>support@mahjong4friends.com</a>";
roomManager.appendChild(supportInfo);

if (window.Capacitor || window.isAndroid) {
  var ratingPrompt = document.createElement("p");
  ratingPrompt.id = "supportInfo";

  if (window.Capacitor) {
    ratingPrompt.innerHTML = "Enjoying Mahjong 4 Friends? Please <a href=\"https://apps.apple.com/us/app/mahjong-4-friends/id1552704332\" target=\"_blank\">rate us in the App Store</a>!";
  } else if (window.isAndroid) {
    ratingPrompt.innerHTML = "Enjoying Mahjong 4 Friends? Please <a href=\"https://play.google.com/store/apps/details?id=com.mahjong4friends.twa\" target=\"_blank\">leave a review on Google Play</a>!";
  }

  roomManager.appendChild(ratingPrompt);
} else {
  var createButton = function createButton(href, src, text) {
    var link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    var img = document.createElement("img");
    img.src = src;
    img.alt = text;
    link.appendChild(img);
    externalAppStoresDiv.appendChild(link);
  };

  var externalAppStoresDiv = document.createElement("div");
  externalAppStoresDiv.id = "externalAppStoresDiv";
  roomManager.appendChild(externalAppStoresDiv);
  createButton("https://apps.apple.com/us/app/mahjong-4-friends/id1552704332", "assets/badges/appstore.svg", "Get Mahjong 4 Friends on the App Store");
  createButton("https://play.google.com/store/apps/details?id=com.mahjong4friends.twa", "assets/badges/googleplay.svg", "Get Mahjong 4 Friends on Google Play");
} //Facebook Embed - https://developers.facebook.com/docs/plugins/page-plugin/


var facebookDiv = document.createElement("div");
setTimeout(function () {
  if (stateManager.inRoom.includes("fbtest")) {
    facebookDiv.innerHTML += "<iframe sandbox=\"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox\" src=\"https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMahjong-4-Friends-103233541852386&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen=\"true\" allow=\"autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share\"></iframe>";
  }
}, 2000);
roomManager.appendChild(facebookDiv);
var copyrightNotice = document.createElement("p");
copyrightNotice.innerHTML = "Copyright © 2020, All Rights Reserved";
copyrightNotice.id = "copyrightNotice";
roomManager.appendChild(copyrightNotice); //TODO: Need some ERROR HANDLING!!!!! speechSynthesis may not work/exist.
//TODO: Also need a way to deal with reloads.
//TODO: Use speechSynthesis onvoiceschange event (or whatever it is).

speechSynthesis.getVoices();
var voiceChoices = {};
window.voiceChoices = voiceChoices;

function VoiceSelector() {
  var voiceOptionsSelect = document.createElement("select");
  var availableVoices = speechSynthesis.getVoices();
  console.log(availableVoices); //We need to have a default, as some browsers (firefox) return an empty array for getVoices, but work.

  var noneChoice = document.createElement("option");
  noneChoice.value = "none";
  noneChoice.innerHTML = "No Voice";
  noneChoice.selected = true;
  voiceOptionsSelect.appendChild(noneChoice);
  var defaultChoice = document.createElement("option");
  defaultChoice.value = "default";
  defaultChoice.innerHTML = "Default Voice"; //defaultChoice.selected = true

  voiceOptionsSelect.appendChild(defaultChoice);
  availableVoices.forEach(function (voice, index) {
    var choice = document.createElement("option");
    choice.value = index;
    choice.innerHTML = voice.lang + "(" + voice.name + ")";
    voiceOptionsSelect.appendChild(choice);
  });
  this.elem = voiceOptionsSelect;

  this.get = function () {
    return availableVoices[Number(voiceOptionsSelect.value)] || voiceOptionsSelect.value;
  };

  this.set = function () {
    var voiceSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "none";
    voiceOptionsSelect.value = voiceSelection;

    if (availableVoices.indexOf(voiceSelection) !== -1) {
      voiceOptionsSelect.value = availableVoices.indexOf(voiceSelection);
    }
  };
}

function renderPlayerView() {
  var clientList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var kickUserCallback = arguments.length > 1 ? arguments[1] : undefined;

  while (playerView.firstChild) {
    playerView.firstChild.remove();
  }

  clientList.forEach(function (obj) {
    var row = document.createElement("div");
    row.classList.add("playerViewRow");
    var nameSpan = document.createElement("span");
    nameSpan.classList.add("playerViewNameSpan");
    nameSpan.innerHTML = obj.nickname;
    row.appendChild(nameSpan);
    var card = document.createElement("span");
    card.classList.add("playerViewCard");
    row.appendChild(card);
    var voiceChoice = document.createElement("span");
    voiceChoice.classList.add("playerViewVoiceChoice");
    row.appendChild(voiceChoice);

    function setNicknameEditable(span, targetId) {
      span.classList.add("editableName");
      var promptText = "Enter a new nickname for ".concat(obj.nickname, ": ");

      if (targetId === window.clientId) {
        promptText = "Enter a new nickname: ";
      }

      nameSpan.addEventListener("click", function () {
        var res = prompt(promptText);

        if (res !== null) {
          window.stateManager.setNickname(res, obj.id);
        }
      });
    }

    if (obj.id === window.clientId) {
      voiceChoice.innerHTML = "N/A"; //You can edit your own nickname.

      setNicknameEditable(nameSpan, obj.id);

      if (window.stateManager.isHost) {
        card.innerHTML = "You (Host)";
      } else {
        card.innerHTML = "You";
      }
    } else {
      voiceChoices[obj.id] = voiceChoices[obj.id] || new VoiceSelector();
      voiceChoice.appendChild(voiceChoices[obj.id].elem);

      if (obj.isHost) {
        card.innerHTML = "Host";
      } else if (window.stateManager.isHost) {
        //The host can edit any nicknames.
        setNicknameEditable(nameSpan, obj.id);
        var kickButton = document.createElement("button");
        kickButton.innerHTML = "Remove " + obj.nickname;
        kickButton.classList.add("playerViewKickButton");
        kickButton.addEventListener("click", function () {
          if (confirm("Are you sure you want to remove " + obj.nickname)) {
            kickUserCallback(obj.id);
          }
        });
        card.appendChild(kickButton);
      } else {
        card.innerHTML = "Player";
      }
    }

    playerView.appendChild(row);
  });
}

function enterRoom() {
  inRoomContainer.style.display = "block";
  notInRoomContainer.style.display = "none";
  var queryParam = "#roomId=" + stateManager.inRoom;
  joinRoomLink.href = queryParam;

  if (window.Capacitor) {
    joinRoomLink.href = "https://mahjong4friends.com" + queryParam;
  }

  inviteYourFriendsElem.style.display = stateManager.offlineMode ? "none" : ""; //Hide invite friends when offline.

  joinRoomLink.innerHTML = joinRoomLink.href;

  try {
    var dpi = 4;
    var qrGenerator = QRCode(0, "H"); //0 is for auto-detection. We want maximum error correction.
    //Generate the code.

    qrGenerator.addData(joinRoomLink.href);
    qrGenerator.make(); //Draw the code into a canvas

    var cnv = document.createElement("canvas");
    var pixelsPerBlock = 3 * dpi;
    cnv.width = cnv.height = qrGenerator.getModuleCount() * pixelsPerBlock;
    var ctx = cnv.getContext("2d");
    qrGenerator.renderTo2dContext(ctx, pixelsPerBlock); //Copy the code into a new canvas, width padding added.

    var paddingPixels = 6 * dpi;
    var drawCanvas = document.createElement("canvas");
    drawCanvas.width = drawCanvas.height = cnv.width + paddingPixels * 2;
    var drawCtx = drawCanvas.getContext("2d");
    drawCtx.fillStyle = "white";
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawCtx.drawImage(cnv, paddingPixels, paddingPixels); //Insert the Mahjong logo.

    var img = document.createElement("img");
    img.src = "assets/tiles/dragons/green.png";
    img.addEventListener("load", function () {
      var centerPadding = 3 * dpi; //Pixels to pad the center image.

      var maxCenterSize = drawCanvas.width * 0.3; //No hard requirement on what we can do, but 20% is fine.

      var width = img.width;
      var height = img.height;
      var ratio = Math.max(1, Math.max(width, height) / maxCenterSize);
      width /= ratio;
      height /= ratio;
      var left = drawCanvas.width / 2 - width / 2;
      var top = drawCanvas.height / 2 - height / 2;
      drawCtx.fillRect(left - centerPadding, top - centerPadding, width + centerPadding * 2, height + centerPadding * 2);
      drawCtx.drawImage(img, left, top, width, height);
      QRImageElement.src = drawCanvas.toDataURL("image/png");
      QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi;
    });
    QRImageElement.src = drawCanvas.toDataURL("image/png");
    QRImageElement.width = QRImageElement.height = drawCanvas.width / dpi;
  } catch (e) {
    console.error(e);
  }
}

function exitRoom() {
  inRoomContainer.style.display = "none";
  notInRoomContainer.style.display = "block";
}

var showRestoreNotice = true;

window.stateManager.onJoinRoom = function (obj) {
  if (obj.status === "error") {
    return new Popups.Notification("Unable to Join Room", obj.message).show();
  } else {
    if (showRestoreNotice && params.has("roomId") && params.get("roomId") !== obj.message) {
      new Popups.Notification("Room Restored", "You followed a link to room " + params.get("roomId") + ", but were already in room " + obj.message + ". Your room has been restored - to join a new room, leave your current one. ").show();
      showRestoreNotice = false;
    }

    currentRoom.innerHTML = "You are in room " + obj.message;
    enterRoom();
  }
};

window.stateManager.onCreateRoom = function (obj) {
  if (obj.status === "error") {
    return new Popups.Notification("Unable to Create Room", obj.message).show();
  } else {
    currentRoom.innerHTML = "You are hosting room " + obj.message;
    enterRoom();
  }
};

window.stateManager.onLeaveRoom = function (obj) {
  exitRoom(); //We left the room. Change clientId.

  var StateManager = __webpack_require__(3642);

  StateManager.setClientId(StateManager.createNewClientId()); //Don't show somebody that they left the room. Just exit.
  //Don't show the host that they closed the room. Just exit.

  if (obj.message !== "You closed the room. " && obj.message !== "You left the room. ") {
    new Popups.Notification("Out of Room", obj.message).show();
  }
};

window.stateManager.addEventListener("onStateUpdate", function (obj) {
  var _gameSettings;

  playerCount.innerHTML = obj.message.clients.length + "/4 Players are Present";
  var choices = (_gameSettings = gameSettings) === null || _gameSettings === void 0 ? void 0 : _gameSettings.getChoices();

  if (window.stateManager.isHost) {
    startGameButton.style.display = "none";
    addBotButton.style.display = "";
    closeRoomButton.style.display = "";
    leaveRoomButton.style.display = "";
    gameSettings = new SettingsMenu(gameSettingsElem, true);
    gameSettings.setChoices(choices);

    if (obj.message.clients.length === 1) {
      //This player is the only one in the room. (So if they aren't host, there's a bug)
      //If they leave, the room closes. Hide the leave room button.
      leaveRoomButton.style.display = "none";
    } else if (obj.message.clients.length >= 4) {
      startGameButton.style.display = "";
      addBotButton.style.display = "none"; //No reason to allow adding bots when game is full.
    }
  } else {
    addBotButton.style.display = "none";
    closeRoomButton.style.display = "none";
    startGameButton.style.display = "none";
    leaveRoomButton.style.display = "";
    gameSettings = new SettingsMenu(gameSettingsElem, false);
    gameSettings.setChoices(choices);
  }

  window.gameSettings = gameSettings; //FOR TESTING!

  renderPlayerView(obj.message.clients, function kickUserCallback(userId) {
    window.stateManager.kickUser(window.stateManager.roomId, userId);
  });
});
window.stateManager.getCurrentRoom(); //If we are already in a room, this will issue the correct callbacks to enter us into it.

window.stateManager.addEventListener("onStartGame", function () {
  roomManager.style.display = "none";
});
window.stateManager.addEventListener("onEndGame", function (obj) {
  roomManager.style.display = "";

  if (obj.message !== "State Sync") {
    //State Sync game ends happen to the person that ends the game, as well as in development mode.
    new Popups.Notification("Game Ended", obj.message).show();
  }
});
module.exports = roomManager;

/***/ }),

/***/ 7537:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(9601);

__webpack_require__(7941);

__webpack_require__(4747);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(8309);

function SettingsMenu(settingsDiv) {
  var isHost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  while (settingsDiv.firstChild) {
    settingsDiv.firstChild.remove();
  } //Construct header.


  var header = document.createElement("h2");
  header.innerHTML = "Game Settings";
  header.style.marginTop = "0";
  header.style.marginBottom = "0.5em";
  settingsDiv.appendChild(header); //Appended later, so these are last.

  var americanMahjongInfo = document.createElement("p");
  americanMahjongInfo.innerHTML = "2021 Card Now Supported! Play with bots or friends (link and/or QR below!) You can play with any card you want - the selected card is only used for automated scoring and bots (which will still run, just on whichever card is selected). <br><br>Not all moves are validated - if you make a mistake, you can use the \"Revert\" button to undo it. ";
  americanMahjongInfo.style.fontSize = "1.3em";
  var chineseMahjongInfo = document.createElement("p");
  chineseMahjongInfo.innerHTML = "Most variants should be supported, although overrides may be needed, and you might need to score your own hands. Can't play your way? Have suggestions? Need different bots? Send an email to support@mahjong4friends.com!";
  chineseMahjongInfo.style.fontSize = "1.3em";
  var options = {}; //Use Object.assign so GameStyleSelector can get a reference to all selectors.

  Object.assign(options, {
    gameStyle: new GameStyleSelector(options, {
      americanMahjongInfo: americanMahjongInfo,
      chineseMahjongInfo: chineseMahjongInfo
    }),
    //Chinese
    maximumSequences: new MaximumSequencesSelector(),
    checkForCalling: new CheckForCallingSelector(),
    botSettings: new BotSettings(),
    //American
    card: new CardSelector(),
    americanBotDifficulty: new AmericanBotDifficulty(),
    disableHints: new DisableHintsSelector() //Both

  });
  var hasChoices = false;

  for (var option in options) {
    var item = options[option];

    if (item.isHost && !isHost) {
      delete options[option];
      continue;
    } else {
      hasChoices = true;
    }

    settingsDiv.appendChild(item.elem);
    item.set(); //Set default choice.
  }

  settingsDiv.style.display = hasChoices ? "" : "none";
  settingsDiv.appendChild(americanMahjongInfo);
  settingsDiv.appendChild(chineseMahjongInfo);

  if (Object.keys(options).length === 0) {
    header.remove();
  } //No settings to show.


  this.getChoices = function () {
    var excludeClient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var obj = {};

    for (var _option in options) {
      obj[_option] = options[_option].get();
    }

    try {
      //TODO: Should we save all changes, or just when getChoices is called (it's called when games are started, etc)
      localStorage.setItem("gameSettings", JSON.stringify(obj));
    } catch (e) {
      console.error(e);
    }

    return obj;
  };

  this.setChoices = function () {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    for (var _option2 in obj) {
      if (options[_option2]) {
        options[_option2].set(obj[_option2]);
      }
    }
  }; //Remember settings across reloads.


  if (localStorage.getItem("gameSettings")) {
    this.setChoices(JSON.parse(localStorage.getItem("gameSettings")));
  }
}

function GameStyleSelector(allSettingsSelectors, _ref) {
  var americanMahjongInfo = _ref.americanMahjongInfo,
      chineseMahjongInfo = _ref.chineseMahjongInfo;
  var elem = document.createElement("div");
  elem.id = "gameStyleSelectorDiv";
  elem.style.marginBottom = "10px";
  var chinese = document.createElement("button");
  chinese.innerHTML = "Chinese/British/HK Mahjong";
  chinese.value = "chinese";
  chinese.id = "selectChineseMahjong";
  elem.appendChild(chinese);
  var american = document.createElement("button");
  american.innerHTML = "American Mahjong";
  american.value = "american";
  american.id = "selectAmericanMahjong";
  elem.appendChild(american);
  var buttons = [chinese, american];

  function setSelectedButton(selectedButton) {
    //Switch the button selected.
    buttons.forEach(function (button) {
      if (button === selectedButton) {
        button.disabled = "disabled";
      } else {
        button.disabled = "";
      }
    });
    americanMahjongInfo.style.display = selectedButton.value === "american" ? "" : "none";
    chineseMahjongInfo.style.display = selectedButton.value === "chinese" ? "" : "none"; //Hide all settings not for this mode.

    for (var prop in allSettingsSelectors) {
      var selector = allSettingsSelectors[prop];

      if (!selector.displayFor || selector.displayFor.includes(selectedButton.value)) {
        selector.elem.style.display = "";
      } else {
        selector.elem.style.display = "none";
      }
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      setSelectedButton(button);
    });
  });
  this.elem = elem;

  this.get = function () {
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];

      if (button.disabled) {
        return button.value;
      }
    }
  };

  this.set = function (value) {
    setSelectedButton("mustbeset");
    buttons.forEach(function (item, i) {
      if (item.value === value) {
        setSelectedButton(item);
      }
    });
  };

  this.isHost = true;
}

function CheckForCallingSelector() {
  var elem = document.createElement("div");
  elem.id = "checkForCallingSelectorDiv";
  var checkbox = document.createElement("input");
  checkbox.id = "checkForCallingSelectorCheckbox";
  checkbox.type = "checkbox";
  var label = document.createElement("label");
  label.for = "checkForCallingSelectorCheckbox";
  label.innerHTML = "Check and Alert for Calling/Ready Hands";
  label.addEventListener("click", function () {
    checkbox.click();
  });
  label.style.fontSize = "1.4em";
  checkbox.style.fontSize = "1.4em";
  this.elem = elem;
  elem.appendChild(checkbox);
  elem.appendChild(label);

  this.get = function () {
    return checkbox.checked;
  };

  this.set = function () {
    var boolean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    checkbox.checked = boolean;
  };

  this.displayFor = ["chinese"];
  this.isHost = true;
}

function MaximumSequencesSelector() {
  var elem = document.createElement("div");
  elem.id = "maximumSequencesSelectorDiv";
  var input = document.createElement("input");
  input.id = "maximumSequencesSelector";
  input.type = "number";
  var label = document.createElement("label");
  label.for = "maximumSequencesSelector";
  label.innerHTML = "Maximum Sequences: ";
  label.style.fontSize = "1.4em";
  input.style.fontSize = "1.4em";
  this.elem = elem;
  elem.appendChild(label);
  elem.appendChild(input);

  this.get = function () {
    return input.value;
  };

  this.set = function (value) {
    input.value = value !== null && value !== void 0 ? value : 4;
  };

  this.displayFor = ["chinese"];
  this.isHost = true;
}

function BotSettings() {
  var elem = document.createElement("div");
  elem.id = "botSelectorDiv";
  var checkbox = document.createElement("input");
  checkbox.id = "botSelectorCheckbox";
  checkbox.type = "checkbox";
  var label = document.createElement("label");
  label.for = "botSelectorCheckbox";
  label.innerHTML = "Allow bot to charleston";
  label.addEventListener("click", function () {
    checkbox.click();
  });
  label.style.fontSize = "1.4em";
  checkbox.style.fontSize = "1.4em";
  this.elem = elem;
  elem.appendChild(checkbox);
  elem.appendChild(label);

  this.get = function () {
    return {
      canCharleston: checkbox.checked
    };
  };

  this.set = function () {
    var _obj$canCharleston;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    checkbox.checked = (_obj$canCharleston = obj === null || obj === void 0 ? void 0 : obj.canCharleston) !== null && _obj$canCharleston !== void 0 ? _obj$canCharleston : false;
  };

  this.displayFor = ["chinese"];
  this.isHost = true;
}

function CardSelector() {
  var elem = document.createElement("div");
  elem.style.marginBottom = "5px";
  var select = document.createElement("select");
  select.style.fontSize = "1.4em";
  var cardOptions = ["2021 National Mahjongg League", "2020 National Mahjongg League"];

  if (window.location.href.includes("marv")) {
    cardOptions.push({
      name: "2021 Marvelous (Partial Scoring & Suggestions)",
      value: "2021 Marvelous Mahjongg"
    });
  }

  cardOptions.push("Other Card - Bots Use Random Card");
  cardOptions.forEach(function (value, index) {
    var option = document.createElement("option");
    option.value = value.value || value;
    option.innerHTML = value.name || value;
    select.appendChild(option);
  });
  var label = document.createElement("label");
  label.innerHTML = "Select Mahjong Card: ";
  label.style.fontSize = "1.4em";
  this.elem = elem;
  elem.appendChild(label);
  elem.appendChild(select);

  this.get = function () {
    return select.value;
  };

  this.set = function () {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "2021 National Mahjongg League";
    select.value = value;
  };

  this.displayFor = ["american"];
  this.isHost = true;
}

function AmericanBotDifficulty() {
  var elem = document.createElement("div");
  elem.style.fontSize = "1.4em";
  var input = document.createElement("input");
  input.type = "range";
  input.min = 0;
  input.max = 100;
  var label = document.createElement("label");
  label.innerHTML = "Bot Difficulty:  Medium"; //Right now, no browser supports labeled tick marks, so we'll just do this.

  var label2 = document.createElement("label");
  label2.innerHTML = "Superhuman";
  this.elem = elem;
  elem.appendChild(label);
  elem.appendChild(input);
  elem.appendChild(label2);

  this.get = function () {
    return input.value;
  };

  this.set = function () {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
    input.value = value;
  };

  this.displayFor = ["american"];
  this.isHost = true;
}

function DisableHintsSelector() {
  var elem = document.createElement("div");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  var label = document.createElement("label");
  label.innerHTML = "Disable Hints/Suggested Hands";
  label.addEventListener("click", function () {
    checkbox.click();
  });
  label.style.fontSize = "1.4em";
  checkbox.style.fontSize = "1.4em";
  this.elem = elem;
  elem.appendChild(checkbox);
  elem.appendChild(label);

  this.get = function () {
    return checkbox.checked;
  };

  this.set = function () {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    checkbox.checked = value;
  };

  this.displayFor = ["american"];
  this.isHost = true;
}

module.exports = SettingsMenu;

/***/ }),

/***/ 7793:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2707);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(6699);

__webpack_require__(1249);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(2946);

var Sequence = /*#__PURE__*/function () {
  "use strict";

  function Sequence() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Sequence);

    if (config.exposed === undefined) {
      throw "config.exposed must not be undefined. ";
    }

    this.isDouble = function (userWind) {
      return false;
    };

    this.getPoints = function () {
      return 0;
    };

    if (!config.tiles instanceof Array) {
      throw "config.tiles must be an array of Tiles";
    }

    if (!Sequence.isValidSequence(config.tiles)) {
      throw "config.tiles is not a valid sequence. ";
    }

    this.tiles = config.tiles; //Sort the sequence.

    this.tiles = this.tiles.sort(function (tile1, tile2) {
      return tile1.value - tile2.value;
    });
    this.exposed = config.exposed;
    this.isSequence = true;
    this.isPongOrKong = false;
    this.isPair = false;

    this.toJSON = function () {
      var obj = {};
      obj.class = "Sequence";
      obj.exposed = this.exposed;
      obj.tiles = this.tiles;
      return JSON.stringify(obj);
    }.bind(this);
  }

  _createClass(Sequence, null, [{
    key: "isValidSequence",
    value: function isValidSequence(tiles) {
      var type = tiles[0].type;
      var values = [];

      if (!["bamboo", "character", "circle"].includes(type)) {
        return false;
      } //Sort the sequence.


      tiles = tiles.sort(function (tile1, tile2) {
        return tile1.value - tile2.value;
      });

      for (var i = 1; i < tiles.length; i++) {
        var tile = tiles[i];

        if (tile.type !== type) {
          return false;
        } //Tiles are not the same suit.


        if (Math.abs(tiles[i - 1].value - tile.value) !== 1) {
          return false;
        } //Tiles are not in a sequence. There is a difference between the values that is not 1.

      }

      if (tiles.length !== 3) {
        return false;
      }

      return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Sequence") {
        throw "String was not created by Sequence.toJSON()";
      }

      obj.tiles = obj.tiles.map(function (tileString) {
        return Tile.fromJSON(tileString);
      });
      return new Sequence(obj);
    }
  }]);

  return Sequence;
}();

module.exports = Sequence;

/***/ }),

/***/ 3642:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(8674);

__webpack_require__(1539);

__webpack_require__(5837);

__webpack_require__(561);

__webpack_require__(4747);

__webpack_require__(285);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(7042);

__webpack_require__(5666);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Popups = __webpack_require__(4376);

var StateManager = /*#__PURE__*/function () {
  "use strict";

  function StateManager(websocketURL) {
    _classCallCheck(this, StateManager);

    //This function is referenced in createWebsocket, so DO NOT move it downwards. You will get burned by a lack of function hoisting.
    var onmessage = function onmessage(message) {
      var obj = JSON.parse(message.data);
      console.log(obj);

      if (obj.type === "joinRoom") {
        onJoinRoom(obj);
      } else if (obj.type === "createRoom") {
        onCreateRoom(obj);
      } else if (obj.type === "roomActionState") {
        onStateUpdate(obj);
      } else if (obj.type === "roomActionKickFromRoom") {//We kicked somebody else. Should probably show an error message or success.
      } else if (obj.type === "roomActionLeaveRoom") {
        onLeaveRoom(obj);
      } else if (obj.type === "getCurrentRoom") {
        onGetCurrentRoom(obj);
      } else if (obj.type === "displayMessage") {
        new Popups.Notification(obj.message.title, obj.message.body).show();
      } else if (obj.type === "roomActionStartGame") {
        onStartGame(obj);
      } else if (obj.type === "roomActionEndGame") {
        onEndGame(obj);
      } else if (obj.type === "roomActionPlaceTiles") {
        if (this.onPlaceTiles instanceof Function) {
          this.onPlaceTiles(obj);
        }
      } else if (obj.type === "roomActionGameplayAlert") {
        if (this.onGameplayAlert instanceof Function) {
          this.onGameplayAlert(obj);
        }
      } else {
        console.log("Unknown Type " + obj.type);
      }
    }.bind(this);

    var popup;

    this.createWebsocket = /*#__PURE__*/function () {
      var _createWebsocket = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var FakeWebsocket, fakeSocket;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.websocket = new WebSocket(websocketURL);
                this.websocket.addEventListener("message", onmessage);
                this.websocket.addEventListener("open", function () {
                  if (window.setConnectionStatus) {
                    window.setConnectionStatus({
                      connected: true
                    });
                  }

                  if (popup) {
                    popup.dismiss();
                    popup = null;
                  }
                });
                this.websocket.addEventListener("error", /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            console.error(e);

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }().bind(this)); //Error events also result in a close, so we end up with exponential blowup if reconnect on both. We'll only reconnect on close.

                this.websocket.addEventListener("close", /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (window.setConnectionStatus) {
                              window.setConnectionStatus({
                                connected: false
                              });
                            }

                            console.warn(e);

                            if (!(e.code !== 1000)) {
                              _context2.next = 8;
                              break;
                            }

                            _context2.next = 5;
                            return new Promise(function (resolve, reject) {
                              setTimeout(resolve, 1000);
                            });

                          case 5:
                            //1 second delay on reconnects.
                            this.createWebsocket();

                            if (!stateManager.offlineMode) {
                              this.getCurrentRoom(); //Syncs state.
                            }

                            if (stateManager.offlineMode === false) {
                              if (popup) {
                                popup.dismiss();
                                popup = null;
                              }

                              popup = new Popups.MessageBar("You Disconnected from the Server. Attempting to Reconnect...");
                              popup.show(8000);
                            }

                          case 8:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }().bind(this));

                FakeWebsocket = /*#__PURE__*/function () {
                  function FakeWebsocket() {
                    _classCallCheck(this, FakeWebsocket);
                  }

                  _createClass(FakeWebsocket, [{
                    key: "on",
                    value: function on(listener, func) {
                      console.log(listener);
                      this.onmessage = func;
                    }
                  }, {
                    key: "send",
                    value: function send(message) {
                      console.log(message);
                      onmessage({
                        data: message
                      });
                    }
                  }]);

                  return FakeWebsocket;
                }();

                fakeSocket = new FakeWebsocket();

                this.sendMessage = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
                    var _this = this;

                    var ServerStateManager;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!this.offlineMode) {
                              _context3.next = 7;
                              break;
                            }

                            if (!this.localServer) {
                              ServerStateManager = __webpack_require__(3093);
                              globalThis.serverStateManager = new ServerStateManager();
                              this.localServer = __webpack_require__(5025);
                              console.log(this.localServer);
                              this.localServer(fakeSocket);
                            }

                            console.log(fakeSocket);

                            if (!fakeSocket.onmessage) {
                              console.log(fakeSocket);
                              this.localServer(fakeSocket);
                            }

                            fakeSocket.onmessage(message);
                            _context3.next = 12;
                            break;

                          case 7:
                            if (!(this.websocket.readyState === 0)) {
                              _context3.next = 10;
                              break;
                            }

                            _context3.next = 10;
                            return new Promise(function (resolve, reject) {
                              _this.websocket.onopen = resolve;
                              _this.websocket.onerror = reject; //TODO: Handle error.
                            });

                          case 10:
                            console.log(message);
                            this.websocket.send(message);

                          case 12:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function (_x3) {
                    return _ref3.apply(this, arguments);
                  };
                }();

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createWebsocket() {
        return _createWebsocket.apply(this, arguments);
      }

      return createWebsocket;
    }().bind(this);

    this.createWebsocket();
    this.inRoom = false;
    this.isHost = false;
    this.inGame = false;

    this.joinRoom = function (roomId, nickname) {
      this.sendMessage(JSON.stringify({
        type: "joinRoom",
        clientId: window.clientId,
        roomId: roomId,
        nickname: nickname
      }));
    };

    this.createRoom = function (roomId, nickname) {
      this.sendMessage(JSON.stringify({
        type: "createRoom",
        clientId: window.clientId,
        roomId: roomId,
        nickname: nickname
      }));
    };

    this.kickUser = function (roomId, userId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionKickFromRoom",
        clientId: window.clientId,
        id: userId ///id of user to kick.

      }));
    };

    this.leaveRoom = function (roomId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionLeaveRoom",
        clientId: window.clientId
      }));
    };

    this.closeRoom = function (roomId) {
      this.sendMessage(JSON.stringify({
        type: "roomActionCloseRoom",
        clientId: window.clientId
      }));
    };

    this.startGame = function () {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.sendMessage(JSON.stringify({
        type: "roomActionStartGame",
        clientId: window.clientId,
        settings: settings
      }));
    };

    this.endGame = function () {
      this.sendMessage(JSON.stringify({
        type: "roomActionEndGame",
        clientId: window.clientId
      }));
    };

    this.placeTiles = function (tiles, mahjong) {
      var obj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.sendMessage(JSON.stringify({
        type: "roomActionPlaceTiles",
        clientId: window.clientId,
        mahjong: mahjong,
        //Undefined is equivalent to false.
        message: tiles,
        swapJoker: obj.swapJoker
      }));
    };

    this.addBot = function (botName) {
      this.sendMessage(JSON.stringify({
        type: "roomActionAddBot",
        clientId: window.clientId,
        botName: botName
      }));
    };

    this.setNickname = function (nickname) {
      var targetId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.clientId;
      this.sendMessage(JSON.stringify({
        type: "roomActionChangeNickname",
        clientId: window.clientId,
        nickname: nickname,
        targetId: targetId
      }));
    };

    this.getCurrentRoom = function () {
      //Get our room.
      this.sendMessage(JSON.stringify({
        "type": "getCurrentRoom",
        clientId: window.clientId
      }));
    }.bind(this);

    this.revertState = function (turns) {
      this.sendMessage(JSON.stringify({
        type: "roomActionRevertState",
        message: turns,
        clientId: window.clientId
      }));
    }.bind(this);

    this.createRoomFromState = function (saveId) {
      //Intended for developer use.
      this.sendMessage(JSON.stringify({
        type: "createRoomFromState",
        saveId: saveId,
        clientId: window.clientId
      }));
    }.bind(this);

    this.getState = function (roomId) {
      console.log("Getting state...");
      this.sendMessage(JSON.stringify({
        type: "roomActionState",
        clientId: window.clientId
      }));
    }; //These are authed for admin use only.


    this.callServerSave = function (auth, saveName) {
      this.sendMessage(JSON.stringify({
        type: "callServerSave",
        auth: auth,
        saveName: saveName
      }));
      console.warn("You will need to manually kill the server on reboot and reload from save. ");
    };

    this.messageAllServerClients = function (auth, title, body) {
      this.sendMessage(JSON.stringify({
        type: "messageAllServerClients",
        auth: auth,
        title: title,
        body: body
      }));
    };

    var onCreateRoom = function onCreateRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = obj.message;
        this.isHost = true;
      }

      if (this.onCreateRoom instanceof Function) {
        this.onCreateRoom(obj);
      }
    }.bind(this);

    var onJoinRoom = function onJoinRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = obj.message;
      }

      if (this.onJoinRoom instanceof Function) {
        this.onJoinRoom(obj);
      }
    }.bind(this);

    var onLeaveRoom = function onLeaveRoom(obj) {
      if (obj.status === "success") {
        this.inRoom = false;
        this.isHost = false;

        if (this.inGame === true) {
          this.inGame = false;
          onEndGame({
            status: "success",
            message: "State Sync"
          });
        }
      }

      if (this.onLeaveRoom instanceof Function) {
        this.onLeaveRoom(obj);
      }
    }.bind(this); //We'll allow multiple listeners for some events.


    var listeners = {
      onStartGame: [],
      onEndGame: [],
      onStateUpdate: []
    };

    this.addEventListener = function addEventListener(type, listener) {
      if (!listeners[type]) {
        throw type + " is not supported by this addEventListener";
      }

      listeners[type].push(listener);
    }.bind(this);

    this.removeEventListener = function addEventListener(type, listener) {
      if (!listeners[type]) {
        throw type + " is not supported by this addEventListener";
      }

      if (listeners.indexOf(listener) === -1) {
        throw "Unable to find listener";
      }

      listeners[type].splice(listeners.indexOf(listener), 1);
    }.bind(this);

    var onStartGame = function onStartGame(obj) {
      if (obj.status === "success") {
        this.inGame = true;
      }

      if (this.onStartGame instanceof Function) {
        this.onStartGame(obj);
      }

      listeners.onStartGame.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onEndGame = function onEndGame(obj) {
      if (obj.status === "success") {
        this.inGame = false;
      }

      if (this.onEndGame instanceof Function) {
        this.onEndGame(obj);
      }

      listeners.onEndGame.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onStateUpdate = function onStateUpdate(obj) {
      this.lastState = obj;
      this.isHost = obj.message.isHost;

      if (this.inGame === false && obj.message.inGame === true) {
        onStartGame({
          status: "success",
          message: "State Sync"
        });
      } else if (this.inGame === true && obj.message.inGame === false) {
        onEndGame({
          status: "success",
          message: "State Sync"
        });
      }

      this.currentTurn = obj.message.currentTurn;

      if (this.onStateUpdate instanceof Function) {
        this.onStateUpdate(obj);
      }

      listeners.onStateUpdate.forEach(function (listener) {
        listener(obj);
      });
    }.bind(this);

    var onGetCurrentRoom = function onGetCurrentRoom(obj) {
      this.inRoom = obj.message || false; //Now, if we are in a room, we should sync state with the room.

      if (this.inRoom) {
        onJoinRoom(obj);
        this.getState(this.inRoom);
      }
    }.bind(this);
  }

  _createClass(StateManager, null, [{
    key: "setClientId",
    value: function setClientId(newId) {
      window.clientId = newId;
      localStorage.setItem("clientId", window.clientId); //Development use only. Warnings should be shown.
      //This will only change the clientId for the session. It will not change localStorage.

      var params = new URLSearchParams("?" + window.location.hash.slice(1));

      if (params.has("clientId")) {
        window.clientId = params.get("clientId");
      }
    }
  }, {
    key: "createNewClientId",
    value: function createNewClientId() {
      return "user" + Math.random() * Math.pow(2, 53);
    }
  }, {
    key: "getClientId",
    value: function getClientId() {
      //Get the users clientId, or create a new one.
      var clientId = localStorage.getItem("clientId");

      if (clientId === null) {
        clientId = StateManager.createNewClientId();
      }

      return clientId;
    }
  }]);

  return StateManager;
}();

StateManager.setClientId(StateManager.getClientId());
module.exports = StateManager;

/***/ }),

/***/ 2946:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(6699);

__webpack_require__(5735);

__webpack_require__(3753);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = /*#__PURE__*/function () {
  "use strict";

  function Tile() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tile);

    this.type = config.type; //Ex. wind, bamboo, character, pretty, dragon

    this.value = config.value; //Ex. 1,3 red, west

    this.getTileName = function () {
      var gameStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "chinese";
      var tileName = this.value + " " + this.type;

      if (gameStyle === "american") {
        var americanTranslations = {
          "bamboo": "bam",
          "character": "crak",
          "circle": "dot"
        };

        if (["flower", "season"].includes(this.type)) {
          tileName = "flower";
        } else {
          tileName = this.value + " " + (americanTranslations[this.type] || this.type);
        }
      }

      if (this.faceDown) {
        //Some face down tiles might be part of a kong.
        if (this.value && this.type) {
          tileName = "Face Down " + tileName;
        } else {
          tileName = "Face Down Tile";
        }
      }

      return tileName;
    }.bind(this);

    if (!this.value && (this.type === "flower" || this.type === "season")) {
      //American Mahjongg - if no value set, pick random.
      //This should only apply for card generated hands, etc, where the flower/season is generic.
      //We might also want to randomize flower/season, just to be fancy.
      this.value = Math.ceil(Math.random() * 4);
    }

    if (config.faceDown) {
      this.faceDown = true;
      this.imageUrl = "assets/tiles/face-down.png";
    } else if (this.type === "joker") {
      this.imageUrl = "assets/tiles/joker.png";
    } else {
      this.imageUrl = "assets/tiles/" + this.type + "s" + "/" + this.value + ".png";
    }

    this.matches = function (tile) {
      if (this.faceDown) {
        return false;
      }

      if (tile instanceof Tile && tile.type === this.type && tile.value === this.value) {
        return true;
      }

      if (["flower", "season"].includes(this.type) && ["flower", "season"].includes(tile.type)) {
        //For American Mahjong - all flowers and seasons are identical.
        //Since Chinese mahjong uses Pretty tiles, this is enough to check.
        return true;
      }

      if (tile.type === "joker" && tile.type === this.type) {
        return true;
      } //Value no-op for jokers.


      return false;
    };

    this.isDouble = function (userWind) {
      return 0;
    };

    this.getPoints = function () {
      return 0;
    };

    this.toJSON = function () {
      var obj = {};
      obj.class = "Tile";
      obj.type = this.type;
      obj.value = this.value;

      if (this.faceDown) {
        obj.faceDown = this.faceDown;
      }

      return JSON.stringify(obj);
    }.bind(this);

    this.isSequence = false;
    this.isPongOrKong = false;
    this.isPair = false;
  }

  _createClass(Tile, null, [{
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "Tile") {
        throw "String was not created by Tile.toJSON()";
      }

      return new Tile(obj);
    }
  }]);

  return Tile;
}();

module.exports = Tile;

/***/ }),

/***/ 502:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(9826);

__webpack_require__(1249);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(2946);

var TileContainer = /*#__PURE__*/function () {
  "use strict";

  function TileContainer() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TileContainer);

    this.isDouble = function (userWind) {
      return false;
    };

    this.getPoints = function () {
      return 0;
    };

    if (!config.tiles instanceof Array) {
      throw "config.tiles must be an array of Tiles";
    }

    this.tiles = config.tiles;
    this.exposed = true;
    this.isSequence = false;
    this.isPongOrKong = false;
    this.isPair = false;

    this.toJSON = function () {
      var obj = {};
      obj.class = "TileContainer";
      obj.exposed = this.exposed;
      obj.tiles = this.tiles;
      return JSON.stringify(obj);
    }.bind(this);
  }

  _createClass(TileContainer, [{
    key: "isValidMatch",
    value: function isValidMatch() {
      var allowJokers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      //Confirm that the tiles all match.
      var validationTile = TileContainer.findNonJoker(this.tiles);

      if (!validationTile) {
        return false;
      }

      if (this.tiles.every(function (tile) {
        if (tile.matches(validationTile) || allowJokers && tile.type === "joker") {
          return true;
        }
      })) {
        return validationTile;
      } //Truthy, and tells them what the match is of.
      else {
          return false;
        }
    }
  }], [{
    key: "findNonJoker",
    value: function findNonJoker(tiles) {
      return tiles.find(function (tile) {
        return tile.type !== "joker";
      });
    }
  }, {
    key: "isValidMatch",
    value: function isValidMatch(tiles, allowJokers) {
      return new TileContainer({
        tiles: tiles
      }).isValidMatch(allowJokers);
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var obj = JSON.parse(str);

      if (obj.class !== "TileContainer") {
        throw "String was not created by TileContainer.toJSON()";
      }

      obj.tiles = obj.tiles.map(function (tileString) {
        return Tile.fromJSON(tileString);
      });
      return new TileContainer(obj);
    }
  }]);

  return TileContainer;
}();

module.exports = TileContainer;

/***/ }),

/***/ 6212:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(2222);

__webpack_require__(5735);

__webpack_require__(3753);

__webpack_require__(3123);

__webpack_require__(4916);

__webpack_require__(4747);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = __webpack_require__(2946);

var Pretty = __webpack_require__(4810);

var SeedRandom = __webpack_require__(7905);

var Wall = /*#__PURE__*/function () {
  "use strict";

  function Wall() {
    var _this = this;

    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random();
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Wall);

    this.drawFirst = function () {
      return this.tiles.pop();
    };

    this.tiles = []; //Time to add the tiles to the deck...

    this.tiles = this.tiles.concat(Wall.getNonPrettyTiles());

    if (!config.noPrettys) {
      ;
      [false, true].forEach(function (isSeason) {
        for (var i = 1; i <= 4; i++) {
          //Prettys are tiles ("flowers") in American Mahjong
          if (!config.prettysAsTiles) {
            _this.tiles.push(new Pretty({
              value: i,
              seasonOrFlower: isSeason ? "season" : "flower"
            }));
          } else {
            _this.tiles.push(new Tile({
              value: i,
              type: isSeason ? "season" : "flower"
            }));
          }
        }
      });
    }

    if (config.includeJokers) {
      for (var i = 0; i < config.includeJokers; i++) {
        this.tiles.push(new Tile({
          type: "joker",
          value: ""
        }));
      }
    } //Randomly mix the tiles.


    Wall.shuffleArray(this.tiles, seed);

    this.toJSON = function () {
      return seed;
    }.bind(this);
  }

  _createClass(Wall, null, [{
    key: "getNonPrettyTiles",
    value: function getNonPrettyTiles() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
      //We have this as a static method because it can be useful to obtain a copy of every playing tiles in the game.
      var tiles = [];

      var _loop = function _loop(i) {
        for (var c = 0; c < amount; c++) {
          ["bamboo", "character", "circle"].forEach(function (type) {
            tiles.push(new Tile({
              type: type,
              value: i
            }));
          });
        }
      };

      for (var i = 1; i <= 9; i++) {
        _loop(i);
      }

      ;
      ["red", "green", "white"].forEach(function (value) {
        for (var _i = 0; _i < amount; _i++) {
          tiles.push(new Tile({
            type: "dragon",
            value: value
          }));
        }
      });
      ["north", "south", "east", "west"].forEach(function (value) {
        for (var _i2 = 0; _i2 < amount; _i2++) {
          tiles.push(new Tile({
            type: "wind",
            value: value
          }));
        }
      });
      return tiles;
    }
  }, {
    key: "shuffleArray",
    value: function shuffleArray(array) {
      var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.random();
      var random = SeedRandom(seed); //Durstenfeld shuffle

      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(random() * (i + 1));
        var _ref = [array[j], array[i]];
        array[i] = _ref[0];
        array[j] = _ref[1];
      }
    }
  }, {
    key: "renderWall",
    value: function renderWall(div, tilesRemaining) {
      while (div.firstChild) {
        div.firstChild.remove();
      } //Delete any existing tiles.


      for (var i = 0; i < tilesRemaining.length; i++) {
        var _stateManager, _stateManager$lastSta, _stateManager$lastSta2, _stateManager$lastSta3;

        var tile = tilesRemaining[i];
        var tileImage = document.createElement("img");
        tileImage.src = tile.imageUrl;
        tileImage.title = tile.getTileName((_stateManager = stateManager) === null || _stateManager === void 0 ? void 0 : (_stateManager$lastSta = _stateManager.lastState) === null || _stateManager$lastSta === void 0 ? void 0 : (_stateManager$lastSta2 = _stateManager$lastSta.message) === null || _stateManager$lastSta2 === void 0 ? void 0 : (_stateManager$lastSta3 = _stateManager$lastSta2.settings) === null || _stateManager$lastSta3 === void 0 ? void 0 : _stateManager$lastSta3.gameStyle);
        div.appendChild(tileImage);
      }

      if (tilesRemaining.length === 0) {
        return;
      } //Don't write "0" to the screen.
      //Write the number of tiles that remain.


      var digits = String(tilesRemaining.length).split("");
      digits.forEach(function (digit) {
        var elem = document.createElement("p");
        elem.innerHTML = digit;
        div.appendChild(elem);
      });
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(str) {
      var seed = str;
      return new Wall(seed);
    }
  }]);

  return Wall;
}();

module.exports = Wall;

/***/ }),

/***/ 2352:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(5666);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

__webpack_require__(2772);

__webpack_require__(6699);

__webpack_require__(2023);

__webpack_require__(8674);

__webpack_require__(1539);

__webpack_require__(2222);

__webpack_require__(285);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

__webpack_require__(6755);

__webpack_require__(9714);

try {
  var isIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1;

  if (isIE) {
    var warning = document.createElement("h2");
    warning.innerHTML = "Internet Explorer is NOT Supported. Choose a different browser (Chrome, Firefox, Edge, Safari, Opera, and most other browsers should work)";
    document.body.insertBefore(warning, document.body.firstChild);
  }
} catch (e) {
  console.error(e);
}

if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register('packagedsw.js');
  } catch (e) {
    console.error(e);
  }
}

document.title = "Mahjong 4 Friends - Free Multiplayer Mahjong";
window.isAndroid = false;

if (document.referrer && document.referrer.includes("android-app://com.mahjong4friends.twa")) {
  window.isAndroid = true;
}

if (window.Capacitor) {
  try {
    ;

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var req, res, latestVersion, deviceInfo, currentVersion, Popups;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch("https://itunes.apple.com/lookup?bundleId=com.mahjong4friends.twa&YourCDNDoesNotChangeCORSHeadersSoMustCacheBust" + Math.random());

            case 2:
              req = _context.sent;
              _context.next = 5;
              return req.json();

            case 5:
              res = _context.sent;
              latestVersion = res.results[0].version;
              _context.next = 9;
              return window.Capacitor.Plugins.Device.getInfo();

            case 9:
              deviceInfo = _context.sent;
              currentVersion = deviceInfo.appVersion; //Using numeric comparison, so version codes can't have more than one decimal.

              if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
                Popups = __webpack_require__(4376);
                new Popups.Notification("App Update", "There is a Mahjong 4 Friends <a href='https://apps.apple.com/us/app/mahjong-4-friends/id1552704332' target='_blank'>app update</a>. Downloading it is recommended. You may issues if you do not update. ").show();
              }

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  } catch (e) {
    console.error(e);
  }
}

__webpack_require__(819);

var sizes = [16, 24, 32, 64, 96, 160, 196];
sizes.forEach(function (size) {
  var favicon = document.createElement("link");
  favicon.rel = "shortcut icon";
  favicon.type = "image/png";
  favicon.sizes = size + "x" + size;
  favicon.href = "assets/icons/".concat(size, "x").concat(size, "-green-dragon.png");
  document.head.appendChild(favicon);
});

var StateManager = __webpack_require__(3642); //Mobile browsers use the touch API - desktop is drag and drop. We'll use a polyfill so we don't have to implement both.


__webpack_require__(8010);

var url = new URL(window.location.origin + window.location.pathname);
url.pathname = "/node";

if (window.location.protocol === "https:") {
  url.protocol = "wss:";
} else {
  url.protocol = "ws:";
}

if (window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.1") || window.location.hostname.startsWith("10.")) {
  //Local development
  url.port = 7591;
}

var websocketURL = url.toString();

if (window.Capacitor) {
  websocketURL = "wss://mahjong4friends.com/node";
}

window.stateManager = new StateManager(websocketURL) //Make classes public to allow for easier development.
;
["Hand", "Tile", "Sequence", "Pretty", "Match", "Wall", "Popups"].forEach(function (className) {
  window[className] = __webpack_require__(5301)("./" + className + ".js");
});

var roomManager = __webpack_require__(2342);

var gameBoard = __webpack_require__(4696); //While viewport relative units work fine on desktop, some mobile browsers will not show the entire viewport, due to the url bar.
//See https://nicolas-hoizey.com/articles/2015/02/18/viewport-height-is-taller-than-the-visible-part-of-the-document-in-some-mobile-browsers/
//We will use CSS variables to counteract this bug.


function setVisibleAreaHeight() {
  document.documentElement.style.setProperty('--vh', "".concat(window.innerHeight / 100, "px"));
  document.documentElement.style.setProperty('--vw', "".concat(window.innerWidth / 100, "px")); //Add some margin to handle the notch.

  var pxLeft = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sal"));
  pxLeft -= 10; //Ignore the small safe area decrease caused by rounded corners.

  document.documentElement.style.setProperty('--shiftPercentageLeft', "".concat(Math.max(0, pxLeft / window.innerWidth)));
  var pxRight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sar"));
  pxRight -= 10; //Ignore the small safe area decrease caused by rounded corners.

  document.documentElement.style.setProperty('--shiftPercentageRight', "".concat(Math.max(0, pxRight / window.innerWidth)));
}

window.addEventListener('resize', setVisibleAreaHeight);
window.addEventListener('orientationchange', setVisibleAreaHeight);
setVisibleAreaHeight(); //Otherwise Safari will scroll the page when the user drags tiles.
//It's possible that we need feature detection for passive listeners, as it may be misinterpreted by older browsers, however I currently observe no side effects.

window.addEventListener('touchmove', function () {}, {
  passive: false
});

/***/ }),

/***/ 819:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(285);

__webpack_require__(1539);

__webpack_require__(8783);

__webpack_require__(6992);

__webpack_require__(3948);

//Handle universal links into the app.
try {
  if (window.Capacitor) {
    //Properly navigates to target.
    var processRedirect = function processRedirect(target) {
      //When reload is called instantly after changing href, the page doesn't navigate, and just reloads the current origin.
      //The href change persists though.
      //Therefore, we reload after changing href, and do not reload if we don't.
      console.log("Current URL: " + window.location.href);
      var url = new URL(target);

      if (url.hash === window.location.hash && url.pathname === window.location.pathname) {
        console.log("Same URLs. Skipping");
      } else if (url.pathname === window.location.pathname) {
        console.log("Same pathname. Setting and reloading. ");
        window.location.hash = url.hash;
        window.location.reload();
      } else {
        console.log("Different pathname. Setting");
        window.location.hash = url.hash; //Hash might be different too. 

        window.location.pathname = url.pathname;
      }
    };

    Capacitor.Plugins.App.addListener('appUrlOpen', function (data) {
      console.log('App opened with URL: ' + data.url);
      processRedirect(data.url);
    });
    Capacitor.Plugins.App.getLaunchUrl().then(function (ret) {
      if (ret && ret.url) {
        console.log('Launch url: ', ret.url);
        processRedirect(ret.url);
      }
    });
  }
} catch (e) {
  console.error(e);
}

/***/ }),

/***/ 3099:
/***/ ((module) => {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ 6077:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);
var create = __webpack_require__(30);
var definePropertyModule = __webpack_require__(3070);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1530:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = __webpack_require__(8710).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5787:
/***/ ((module) => {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ 9670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ 1285:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toObject = __webpack_require__(7908);
var toAbsoluteIndex = __webpack_require__(1400);
var toLength = __webpack_require__(7466);

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ 8533:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $forEach = __webpack_require__(2092).forEach;
var arrayMethodIsStrict = __webpack_require__(9341);

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ 8457:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bind = __webpack_require__(9974);
var toObject = __webpack_require__(7908);
var callWithSafeIterationClosing = __webpack_require__(3411);
var isArrayIteratorMethod = __webpack_require__(7659);
var toLength = __webpack_require__(7466);
var createProperty = __webpack_require__(6135);
var getIteratorMethod = __webpack_require__(1246);

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ 1318:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIndexedObject = __webpack_require__(5656);
var toLength = __webpack_require__(7466);
var toAbsoluteIndex = __webpack_require__(1400);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 2092:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var bind = __webpack_require__(9974);
var IndexedObject = __webpack_require__(8361);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var arraySpeciesCreate = __webpack_require__(5417);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod(7)
};


/***/ }),

/***/ 1194:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ 9341:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(7293);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ 3671:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aFunction = __webpack_require__(3099);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);
var toLength = __webpack_require__(7466);

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),

/***/ 5417:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);
var isArray = __webpack_require__(3157);
var wellKnownSymbol = __webpack_require__(5112);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ 3411:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var iteratorClose = __webpack_require__(9212);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};


/***/ }),

/***/ 7072:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ 4326:
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 648:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var classofRaw = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),

/***/ 9920:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(6656);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),

/***/ 4964:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};


/***/ }),

/***/ 8544:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 4994:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = __webpack_require__(3383).IteratorPrototype;
var create = __webpack_require__(30);
var createPropertyDescriptor = __webpack_require__(9114);
var setToStringTag = __webpack_require__(8003);
var Iterators = __webpack_require__(7497);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ 8880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 6135:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(7593);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ 654:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var createIteratorConstructor = __webpack_require__(4994);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var setToStringTag = __webpack_require__(8003);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);
var Iterators = __webpack_require__(7497);
var IteratorsCore = __webpack_require__(3383);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),

/***/ 7235:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var path = __webpack_require__(857);
var has = __webpack_require__(6656);
var wrappedWellKnownSymbolModule = __webpack_require__(6061);
var defineProperty = __webpack_require__(3070).f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ 9781:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 317:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 8324:
/***/ ((module) => {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ 6833:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var userAgent = __webpack_require__(8113);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),

/***/ 5268:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(4326);
var global = __webpack_require__(7854);

module.exports = classof(global.process) == 'process';


/***/ }),

/***/ 1036:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var userAgent = __webpack_require__(8113);

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ 8113:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 7392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),

/***/ 748:
/***/ ((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 2109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = __webpack_require__(1236).f;
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var setGlobal = __webpack_require__(3505);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 7007:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(4916);
var redefine = __webpack_require__(1320);
var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var regexpExec = __webpack_require__(2261);
var createNonEnumerableProperty = __webpack_require__(8880);

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ }),

/***/ 6790:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isArray = __webpack_require__(3157);
var toLength = __webpack_require__(7466);
var bind = __webpack_require__(9974);

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind(mapper, thisArg, 3) : false;
  var element;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray(element)) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

module.exports = flattenIntoArray;


/***/ }),

/***/ 9974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aFunction = __webpack_require__(3099);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 7065:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aFunction = __webpack_require__(3099);
var isObject = __webpack_require__(111);

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};


/***/ }),

/***/ 5005:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var path = __webpack_require__(857);
var global = __webpack_require__(7854);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 1246:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(648);
var Iterators = __webpack_require__(7497);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 8554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var getIteratorMethod = __webpack_require__(1246);

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};


/***/ }),

/***/ 7854:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 6656:
/***/ ((module) => {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 3501:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 842:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),

/***/ 490:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 4664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 8361:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),

/***/ 9587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);
var setPrototypeOf = __webpack_require__(7674);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 2788:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var store = __webpack_require__(5465);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(8536);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var objectHas = __webpack_require__(6656);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 7659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);
var Iterators = __webpack_require__(7497);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 3157:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ 4705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 111:
/***/ ((module) => {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 1913:
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ 7850:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);
var classof = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ 408:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var isArrayIteratorMethod = __webpack_require__(7659);
var toLength = __webpack_require__(7466);
var bind = __webpack_require__(9974);
var getIteratorMethod = __webpack_require__(1246);
var iteratorClose = __webpack_require__(9212);

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};


/***/ }),

/***/ 9212:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);

module.exports = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};


/***/ }),

/***/ 3383:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(7293);
var getPrototypeOf = __webpack_require__(9518);
var createNonEnumerableProperty = __webpack_require__(8880);
var has = __webpack_require__(6656);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 7497:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 5948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = __webpack_require__(1236).f;
var macrotask = __webpack_require__(261).set;
var IS_IOS = __webpack_require__(6833);
var IS_WEBOS_WEBKIT = __webpack_require__(1036);
var IS_NODE = __webpack_require__(5268);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),

/***/ 3366:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);

module.exports = global.Promise;


/***/ }),

/***/ 133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_NODE = __webpack_require__(5268);
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // eslint-disable-next-line es/no-symbol -- required for testing
  return !Symbol.sham &&
    // Chrome 38 Symbol has incorrect toString conversion
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    (IS_NODE ? V8_VERSION === 38 : V8_VERSION > 37 && V8_VERSION < 41);
});


/***/ }),

/***/ 590:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);
var wellKnownSymbol = __webpack_require__(5112);
var IS_PURE = __webpack_require__(1913);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});


/***/ }),

/***/ 8536:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var inspectSource = __webpack_require__(2788);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ 8523:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aFunction = __webpack_require__(3099);

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 3929:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isRegExp = __webpack_require__(7850);

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ 1574:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var objectKeys = __webpack_require__(1956);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var propertyIsEnumerableModule = __webpack_require__(5296);
var toObject = __webpack_require__(7908);
var IndexedObject = __webpack_require__(8361);

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ 30:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var defineProperties = __webpack_require__(6048);
var enumBugKeys = __webpack_require__(748);
var hiddenKeys = __webpack_require__(3501);
var html = __webpack_require__(490);
var documentCreateElement = __webpack_require__(317);
var sharedKey = __webpack_require__(6200);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),

/***/ 6048:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var anObject = __webpack_require__(9670);
var objectKeys = __webpack_require__(1956);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ 3070:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var anObject = __webpack_require__(9670);
var toPrimitive = __webpack_require__(7593);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPrimitive = __webpack_require__(7593);
var has = __webpack_require__(6656);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),

/***/ 1156:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-object-getownpropertynames -- safe */
var toIndexedObject = __webpack_require__(5656);
var $getOwnPropertyNames = __webpack_require__(8006).f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ 8006:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ ((__unused_webpack_module, exports) => {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 9518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(6656);
var toObject = __webpack_require__(7908);
var sharedKey = __webpack_require__(6200);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 6324:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(6656);
var toIndexedObject = __webpack_require__(5656);
var indexOf = __webpack_require__(1318).indexOf;
var hiddenKeys = __webpack_require__(3501);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 1956:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 5296:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 7674:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-proto -- safe */
var anObject = __webpack_require__(9670);
var aPossiblePrototype = __webpack_require__(6077);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 288:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var classof = __webpack_require__(648);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ 3887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(5005);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 857:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);

module.exports = global;


/***/ }),

/***/ 2534:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ 9478:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var newPromiseCapability = __webpack_require__(8523);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 2248:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var redefine = __webpack_require__(1320);

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ 1320:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var createNonEnumerableProperty = __webpack_require__(8880);
var has = __webpack_require__(6656);
var setGlobal = __webpack_require__(3505);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),

/***/ 7651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(4326);
var regexpExec = __webpack_require__(2261);

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ 2261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var regexpFlags = __webpack_require__(7066);
var stickyHelpers = __webpack_require__(2999);
var shared = __webpack_require__(2309);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ 7066:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(9670);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ 2999:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var fails = __webpack_require__(7293);

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),

/***/ 4488:
/***/ ((module) => {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 3505:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var createNonEnumerableProperty = __webpack_require__(8880);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 6340:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(5005);
var definePropertyModule = __webpack_require__(3070);
var wellKnownSymbol = __webpack_require__(5112);
var DESCRIPTORS = __webpack_require__(9781);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ 8003:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(3070).f;
var has = __webpack_require__(6656);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ 6200:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var setGlobal = __webpack_require__(3505);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.10.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 6707:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(9670);
var aFunction = __webpack_require__(3099);
var wellKnownSymbol = __webpack_require__(5112);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),

/***/ 8710:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(9958);
var requireObjectCoercible = __webpack_require__(4488);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ 3197:
/***/ ((module) => {

"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};


/***/ }),

/***/ 8415:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toInteger = __webpack_require__(9958);
var requireObjectCoercible = __webpack_require__(4488);

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};


/***/ }),

/***/ 6091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(7293);
var whitespaces = __webpack_require__(1361);

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ }),

/***/ 3111:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(4488);
var whitespaces = __webpack_require__(1361);

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),

/***/ 261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var fails = __webpack_require__(7293);
var bind = __webpack_require__(9974);
var html = __webpack_require__(490);
var createElement = __webpack_require__(317);
var IS_IOS = __webpack_require__(6833);
var IS_NODE = __webpack_require__(5268);

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ 1400:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(9958);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5656:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9958:
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),

/***/ 7466:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(9958);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(4488);

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(111);

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 1694:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 9711:
/***/ ((module) => {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),

/***/ 3307:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(133);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 6061:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(5112);

exports.f = wellKnownSymbol;


/***/ }),

/***/ 5112:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var has = __webpack_require__(6656);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(133);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && has(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 1361:
/***/ ((module) => {

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ 2222:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var isArray = __webpack_require__(3157);
var isObject = __webpack_require__(111);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var createProperty = __webpack_require__(6135);
var arraySpeciesCreate = __webpack_require__(5417);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);
var wellKnownSymbol = __webpack_require__(5112);
var V8_VERSION = __webpack_require__(7392);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ 3290:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var fill = __webpack_require__(1285);
var addToUnscopables = __webpack_require__(1223);

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');


/***/ }),

/***/ 7327:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $filter = __webpack_require__(2092).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 4553:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $findIndex = __webpack_require__(2092).findIndex;
var addToUnscopables = __webpack_require__(1223);

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);


/***/ }),

/***/ 9826:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $find = __webpack_require__(2092).find;
var addToUnscopables = __webpack_require__(1223);

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ 6535:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var flattenIntoArray = __webpack_require__(6790);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var aFunction = __webpack_require__(3099);
var arraySpeciesCreate = __webpack_require__(5417);

// `Array.prototype.flatMap` method
// https://tc39.es/ecma262/#sec-array.prototype.flatmap
$({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A;
    aFunction(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});


/***/ }),

/***/ 4944:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var flattenIntoArray = __webpack_require__(6790);
var toObject = __webpack_require__(7908);
var toLength = __webpack_require__(7466);
var toInteger = __webpack_require__(9958);
var arraySpeciesCreate = __webpack_require__(5417);

// `Array.prototype.flat` method
// https://tc39.es/ecma262/#sec-array.prototype.flat
$({ target: 'Array', proto: true }, {
  flat: function flat(/* depthArg = 1 */) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});


/***/ }),

/***/ 1038:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var from = __webpack_require__(8457);
var checkCorrectnessOfIteration = __webpack_require__(7072);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ 6699:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $includes = __webpack_require__(1318).includes;
var addToUnscopables = __webpack_require__(1223);

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 2772:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__(2109);
var $indexOf = __webpack_require__(1318).indexOf;
var arrayMethodIsStrict = __webpack_require__(9341);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 6992:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(5656);
var addToUnscopables = __webpack_require__(1223);
var Iterators = __webpack_require__(7497);
var InternalStateModule = __webpack_require__(9909);
var defineIterator = __webpack_require__(654);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ 9600:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var IndexedObject = __webpack_require__(8361);
var toIndexedObject = __webpack_require__(5656);
var arrayMethodIsStrict = __webpack_require__(9341);

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),

/***/ 1249:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $map = __webpack_require__(2092).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 5827:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $reduce = __webpack_require__(3671).left;
var arrayMethodIsStrict = __webpack_require__(9341);
var CHROME_VERSION = __webpack_require__(7392);
var IS_NODE = __webpack_require__(5268);

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 5069:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var isArray = __webpack_require__(3157);

var nativeReverse = [].reverse;
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});


/***/ }),

/***/ 7042:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var isObject = __webpack_require__(111);
var isArray = __webpack_require__(3157);
var toAbsoluteIndex = __webpack_require__(1400);
var toLength = __webpack_require__(7466);
var toIndexedObject = __webpack_require__(5656);
var createProperty = __webpack_require__(6135);
var wellKnownSymbol = __webpack_require__(5112);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ 2707:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var aFunction = __webpack_require__(3099);
var toObject = __webpack_require__(7908);
var fails = __webpack_require__(7293);
var arrayMethodIsStrict = __webpack_require__(9341);

var test = [];
var nativeSort = test.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ 561:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var toAbsoluteIndex = __webpack_require__(1400);
var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);
var toObject = __webpack_require__(7908);
var arraySpeciesCreate = __webpack_require__(5417);
var createProperty = __webpack_require__(6135);
var arrayMethodHasSpeciesSupport = __webpack_require__(1194);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),

/***/ 9244:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = __webpack_require__(1223);

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flatMap');


/***/ }),

/***/ 5735:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var toObject = __webpack_require__(7908);
var toPrimitive = __webpack_require__(7593);

var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.es/ecma262/#sec-date.prototype.tojson
$({ target: 'Date', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});


/***/ }),

/***/ 8309:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(9781);
var defineProperty = __webpack_require__(3070).f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ 5837:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);

// `globalThis` object
// https://tc39.es/ecma262/#sec-globalthis
$({ global: true }, {
  globalThis: global
});


/***/ }),

/***/ 9653:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var isForced = __webpack_require__(4705);
var redefine = __webpack_require__(1320);
var has = __webpack_require__(6656);
var classof = __webpack_require__(4326);
var inheritIfRequired = __webpack_require__(9587);
var toPrimitive = __webpack_require__(7593);
var fails = __webpack_require__(7293);
var create = __webpack_require__(30);
var getOwnPropertyNames = __webpack_require__(8006).f;
var getOwnPropertyDescriptor = __webpack_require__(1236).f;
var defineProperty = __webpack_require__(3070).f;
var trim = __webpack_require__(3111).trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}


/***/ }),

/***/ 9601:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var assign = __webpack_require__(1574);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ 489:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var fails = __webpack_require__(7293);
var toObject = __webpack_require__(7908);
var nativeGetPrototypeOf = __webpack_require__(9518);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});



/***/ }),

/***/ 7941:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var nativeKeys = __webpack_require__(1956);
var fails = __webpack_require__(7293);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ 1539:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var redefine = __webpack_require__(1320);
var toString = __webpack_require__(288);

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ 8674:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var IS_PURE = __webpack_require__(1913);
var global = __webpack_require__(7854);
var getBuiltIn = __webpack_require__(5005);
var NativePromise = __webpack_require__(3366);
var redefine = __webpack_require__(1320);
var redefineAll = __webpack_require__(2248);
var setToStringTag = __webpack_require__(8003);
var setSpecies = __webpack_require__(6340);
var isObject = __webpack_require__(111);
var aFunction = __webpack_require__(3099);
var anInstance = __webpack_require__(5787);
var inspectSource = __webpack_require__(2788);
var iterate = __webpack_require__(408);
var checkCorrectnessOfIteration = __webpack_require__(7072);
var speciesConstructor = __webpack_require__(6707);
var task = __webpack_require__(261).set;
var microtask = __webpack_require__(5948);
var promiseResolve = __webpack_require__(9478);
var hostReportErrors = __webpack_require__(842);
var newPromiseCapabilityModule = __webpack_require__(8523);
var perform = __webpack_require__(2534);
var InternalStateModule = __webpack_require__(9909);
var isForced = __webpack_require__(4705);
var wellKnownSymbol = __webpack_require__(5112);
var IS_NODE = __webpack_require__(5268);
var V8_VERSION = __webpack_require__(7392);

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && !NATIVE_REJECTION_EVENT) return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ 2419:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var aFunction = __webpack_require__(3099);
var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var create = __webpack_require__(30);
var bind = __webpack_require__(7065);
var fails = __webpack_require__(7293);

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});


/***/ }),

/***/ 4916:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var exec = __webpack_require__(2261);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ 9714:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var redefine = __webpack_require__(1320);
var anObject = __webpack_require__(9670);
var fails = __webpack_require__(7293);
var flags = __webpack_require__(7066);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),

/***/ 2023:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var notARegExp = __webpack_require__(3929);
var requireObjectCoercible = __webpack_require__(4488);
var correctIsRegExpLogic = __webpack_require__(4964);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ 8783:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = __webpack_require__(8710).charAt;
var InternalStateModule = __webpack_require__(9909);
var defineIterator = __webpack_require__(654);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ 2481:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(2109);
var repeat = __webpack_require__(8415);

// `String.prototype.repeat` method
// https://tc39.es/ecma262/#sec-string.prototype.repeat
$({ target: 'String', proto: true }, {
  repeat: repeat
});


/***/ }),

/***/ 3123:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(7007);
var isRegExp = __webpack_require__(7850);
var anObject = __webpack_require__(9670);
var requireObjectCoercible = __webpack_require__(4488);
var speciesConstructor = __webpack_require__(6707);
var advanceStringIndex = __webpack_require__(1530);
var toLength = __webpack_require__(7466);
var callRegExpExec = __webpack_require__(7651);
var regexpExec = __webpack_require__(2261);
var fails = __webpack_require__(7293);

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),

/***/ 6755:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var getOwnPropertyDescriptor = __webpack_require__(1236).f;
var toLength = __webpack_require__(7466);
var notARegExp = __webpack_require__(3929);
var requireObjectCoercible = __webpack_require__(4488);
var correctIsRegExpLogic = __webpack_require__(4964);
var IS_PURE = __webpack_require__(1913);

// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var $startsWith = ''.startsWith;
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = String(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ 3210:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var $trim = __webpack_require__(3111).trim;
var forcedStringTrimMethod = __webpack_require__(6091);

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),

/***/ 1817:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(2109);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var has = __webpack_require__(6656);
var isObject = __webpack_require__(111);
var defineProperty = __webpack_require__(3070).f;
var copyConstructorProperties = __webpack_require__(9920);

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ 2165:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var defineWellKnownSymbol = __webpack_require__(7235);

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ 2526:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var getBuiltIn = __webpack_require__(5005);
var IS_PURE = __webpack_require__(1913);
var DESCRIPTORS = __webpack_require__(9781);
var NATIVE_SYMBOL = __webpack_require__(133);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);
var fails = __webpack_require__(7293);
var has = __webpack_require__(6656);
var isArray = __webpack_require__(3157);
var isObject = __webpack_require__(111);
var anObject = __webpack_require__(9670);
var toObject = __webpack_require__(7908);
var toIndexedObject = __webpack_require__(5656);
var toPrimitive = __webpack_require__(7593);
var createPropertyDescriptor = __webpack_require__(9114);
var nativeObjectCreate = __webpack_require__(30);
var objectKeys = __webpack_require__(1956);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertyNamesExternal = __webpack_require__(1156);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var shared = __webpack_require__(2309);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);
var uid = __webpack_require__(9711);
var wellKnownSymbol = __webpack_require__(5112);
var wrappedWellKnownSymbolModule = __webpack_require__(6061);
var defineWellKnownSymbol = __webpack_require__(7235);
var setToStringTag = __webpack_require__(8003);
var InternalStateModule = __webpack_require__(9909);
var $forEach = __webpack_require__(2092).forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ 4747:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var forEach = __webpack_require__(8533);
var createNonEnumerableProperty = __webpack_require__(8880);

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),

/***/ 3948:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(7854);
var DOMIterables = __webpack_require__(8324);
var ArrayIteratorMethods = __webpack_require__(6992);
var createNonEnumerableProperty = __webpack_require__(8880);
var wellKnownSymbol = __webpack_require__(5112);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),

/***/ 1637:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(6992);
var $ = __webpack_require__(2109);
var getBuiltIn = __webpack_require__(5005);
var USE_NATIVE_URL = __webpack_require__(590);
var redefine = __webpack_require__(1320);
var redefineAll = __webpack_require__(2248);
var setToStringTag = __webpack_require__(8003);
var createIteratorConstructor = __webpack_require__(4994);
var InternalStateModule = __webpack_require__(9909);
var anInstance = __webpack_require__(5787);
var hasOwn = __webpack_require__(6656);
var bind = __webpack_require__(9974);
var classof = __webpack_require__(648);
var anObject = __webpack_require__(9670);
var isObject = __webpack_require__(111);
var create = __webpack_require__(30);
var createPropertyDescriptor = __webpack_require__(9114);
var getIterator = __webpack_require__(8554);
var getIteratorMethod = __webpack_require__(1246);
var wellKnownSymbol = __webpack_require__(5112);

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};


/***/ }),

/***/ 285:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(8783);
var $ = __webpack_require__(2109);
var DESCRIPTORS = __webpack_require__(9781);
var USE_NATIVE_URL = __webpack_require__(590);
var global = __webpack_require__(7854);
var defineProperties = __webpack_require__(6048);
var redefine = __webpack_require__(1320);
var anInstance = __webpack_require__(5787);
var has = __webpack_require__(6656);
var assign = __webpack_require__(1574);
var arrayFrom = __webpack_require__(8457);
var codeAt = __webpack_require__(8710).codeAt;
var toASCII = __webpack_require__(3197);
var setToStringTag = __webpack_require__(8003);
var URLSearchParamsModule = __webpack_require__(1637);
var InternalStateModule = __webpack_require__(9909);

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable no-control-regex -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\t\u000A\u000D #%/:?@[\\]]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\t\u000A\u000D #/:?@[\\]]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
var TAB_AND_NEW_LINE = /[\t\u000A\u000D]/g;
/* eslint-enable no-control-regex -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});


/***/ }),

/***/ 3753:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(2109);

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});


/***/ }),

/***/ 8010:
/***/ (() => {

var DragDropTouch;
(function (DragDropTouch_1) {
    'use strict';
    /**
     * Object used to hold the data that is being dragged during drag and drop operations.
     *
     * It may hold one or more data items of different types. For more information about
     * drag and drop operations and data transfer objects, see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
     *
     * This object is created automatically by the @see:DragDropTouch singleton and is
     * accessible through the @see:dataTransfer property of all drag events.
     */
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, 'dropEffect', {
            /**
             * Gets or sets the type of drag-and-drop operation currently selected.
             * The value must be 'none',  'copy',  'link', or 'move'.
             */
            get: function () {
                return this._dropEffect;
            },
            set: function (value) {
                this._dropEffect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, 'effectAllowed', {
            /**
             * Gets or sets the types of operations that are possible.
             * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
             * 'linkMove', 'move', 'all' or 'uninitialized'.
             */
            get: function () {
                return this._effectAllowed;
            },
            set: function (value) {
                this._effectAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, 'types', {
            /**
             * Gets an array of strings giving the formats that were set in the @see:dragstart event.
             */
            get: function () {
                return Object.keys(this._data);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Removes the data associated with a given type.
         *
         * The type argument is optional. If the type is empty or not specified, the data
         * associated with all types is removed. If data for the specified type does not exist,
         * or the data transfer contains no data, this method will have no effect.
         *
         * @param type Type of data to remove.
         */
        DataTransfer.prototype.clearData = function (type) {
            if (type != null) {
                delete this._data[type];
            }
            else {
                this._data = null;
            }
        };
        /**
         * Retrieves the data for a given type, or an empty string if data for that type does
         * not exist or the data transfer contains no data.
         *
         * @param type Type of data to retrieve.
         */
        DataTransfer.prototype.getData = function (type) {
            return this._data[type] || '';
        };
        /**
         * Set the data for a given type.
         *
         * For a list of recommended drag types, please see
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
         *
         * @param type Type of data to add.
         * @param value Data to add.
         */
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type] = value;
        };
        /**
         * Set the image to be used for dragging if a custom one is desired.
         *
         * @param img An image element to use as the drag feedback image.
         * @param offsetX The horizontal offset within the image.
         * @param offsetY The vertical offset within the image.
         */
        DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
            var ddt = DragDropTouch._instance;
            ddt._imgCustom = img;
            ddt._imgOffset = { x: offsetX, y: offsetY };
        };
        return DataTransfer;
    }());
    DragDropTouch_1.DataTransfer = DataTransfer;
    /**
     * Defines a class that adds support for touch-based HTML5 drag/drop operations.
     *
     * The @see:DragDropTouch class listens to touch events and raises the
     * appropriate HTML5 drag/drop events as if the events had been caused
     * by mouse actions.
     *
     * The purpose of this class is to enable using existing, standard HTML5
     * drag/drop code on mobile devices running IOS or Android.
     *
     * To use, include the DragDropTouch.js file on the page. The class will
     * automatically start monitoring touch events and will raise the HTML5
     * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
     * should be handled by the application.
     *
     * For details and examples on HTML drag and drop, see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
     */
    var DragDropTouch = (function () {
        /**
         * Initializes the single instance of the @see:DragDropTouch class.
         */
        function DragDropTouch() {
            this._lastClick = 0;
            // enforce singleton pattern
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            // detect passive event support
            // https://github.com/Modernizr/Modernizr/issues/1894
            var supportsPassive = false;
            document.addEventListener('test', function () { }, {
                get passive() {
                    supportsPassive = true;
                    return true;
                }
            });
            // listen to touch events
            if ('ontouchstart' in document) {
                var d = document, ts = this._touchstart.bind(this), tm = this._touchmove.bind(this), te = this._touchend.bind(this), opt = supportsPassive ? { passive: false, capture: false } : false;
                d.addEventListener('touchstart', ts, opt);
                d.addEventListener('touchmove', tm, opt);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
        }
        /**
         * Gets a reference to the @see:DragDropTouch singleton.
         */
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        // ** event handlers
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                // raise double-click and prevent zooming
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        this._reset();
                        return;
                    }
                }
                // clear all variables
                this._reset();
                // get nearest draggable element
                var src = this._closestDraggable(e.target);
                if (src) {
                    // give caller a chance to handle the hover/move events
                    if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                        !this._dispatchEvent(e, 'mousedown', e.target)) {
                        // get ready to start dragging
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        if (e.cancelable) {
                            e.preventDefault();
                        }
                        // show context menu if the user hasn't started dragging after a while
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                        if (DragDropTouch._ISPRESSHOLDMODE) {
                            this._pressHoldInterval = setTimeout(function () {
                                _this._isDragEnabled = true;
                                _this._touchmove(e);
                            }, DragDropTouch._PRESSHOLDAWAIT);
                        }
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldCancelPressHoldMove(e)) {
              this._reset();
              return;
            }
            if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
                // see if target wants to handle move
                var target = this._getTarget(e);
                if (this._dispatchEvent(e, 'mousemove', target)) {
                    this._lastTouch = e;
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                return;
                }
                // start dragging
                if (this._dragSource && !this._img && this._shouldStartDragging(e)) {
                    this._dispatchEvent(e, 'dragstart', this._dragSource);
                    this._createImage(e);
                    this._dispatchEvent(e, 'dragenter', target);
                }
                // continue dragging
                if (this._img) {
                    this._lastTouch = e;
                    if (e.cancelable) {
                        e.preventDefault(); // prevent scrolling
                    }
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._moveImage(e);
                    this._isDropZone = this._dispatchEvent(e, 'dragover', target);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                // see if target wants to handle up
                if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    return;
                }
                // user clicked the element but didn't drag, so clear the source and simulate a click
                if (!this._img) {
                    this._dragSource = null;
                    this._dispatchEvent(this._lastTouch, 'click', e.target);
                    this._lastClick = Date.now();
                }
                // finish dragging
                this._destroyImage();
                if (this._dragSource) {
                    if (e.type.indexOf('cancel') < 0 && this._isDropZone) {
                        this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    }
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                }
            }
        };
        // ** utilities
        // ignore events that have been handled or that involve more than one touch
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e &&
                !e.defaultPrevented &&
                e.touches && e.touches.length < 2;
        };

        // use regular condition outside of press & hold mode
        DragDropTouch.prototype._shouldHandleMove = function (e) {
          return !DragDropTouch._ISPRESSHOLDMODE && this._shouldHandle(e);
        };

        // allow to handle moves that involve many touches for press & hold
        DragDropTouch.prototype._shouldHandlePressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE &&
              this._isDragEnabled && e && e.touches && e.touches.length;
        };

        // reset data if user drags without pressing & holding
        DragDropTouch.prototype._shouldCancelPressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE && !this._isDragEnabled &&
              this._getDelta(e) > DragDropTouch._PRESSHOLDMARGIN;
        };

        // start dragging when specified delta is detected
        DragDropTouch.prototype._shouldStartDragging = function (e) {
            var delta = this._getDelta(e);
            return delta > DragDropTouch._THRESHOLD ||
                (DragDropTouch._ISPRESSHOLDMODE && delta >= DragDropTouch._PRESSHOLDTHRESHOLD);
        }

        // clear all members
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._isDragEnabled = false;
            this._isDropZone = false;
            this._dataTransfer = new DataTransfer();
            clearInterval(this._pressHoldInterval);
        };
        // get point for a touch event
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches) {
                e = e.touches[0];
            }
            return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
        };
        // get distance between the current touch event and the first one
        DragDropTouch.prototype._getDelta = function (e) {
            if (DragDropTouch._ISPRESSHOLDMODE && !this._ptDown) { return 0; }
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        // get the element at a given touch event
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        // create drag image from source element
        DragDropTouch.prototype._createImage = function (e) {
            // just in case...
            if (this._img) {
                this._destroyImage();
            }
            // create drag image from custom element or drag source
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            // if creating from drag source, apply offset and opacity
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = DragDropTouch._OPACITY.toString();
            }
            // add image to document
            this._moveImage(e);
            document.body.appendChild(this._img);
        };
        // dispose of drag image element
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        // move the drag image element
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            requestAnimationFrame(function () {
                if (_this._img) {
                    var pt = _this._getPoint(e, true), s = _this._img.style;
                    s.position = 'absolute';
                    s.pointerEvents = 'none';
                    s.zIndex = '999999';
                    s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                    s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
                }
            });
        };
        // copy properties from an object to another
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            // remove potentially troublesome attributes
            DragDropTouch._rmvAtts.forEach(function (att) {
                dst.removeAttribute(att);
            });
            // copy canvas content
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            // copy style (without transitions)
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                if (key.indexOf('transition') < 0) {
                    dst.style[key] = cs[key];
                }
            }
            dst.style.pointerEvents = 'none';
            // and repeat for all children
            for (var i = 0; i < src.children.length; i++) {
                this._copyStyle(src.children[i], dst.children[i]);
            }
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        // gets an element's closest draggable ancestor
        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.hasAttribute('draggable') && e.draggable) {
                    return e;
                }
            }
            return null;
        };
        return DragDropTouch;
    }());
    /*private*/ DragDropTouch._instance = new DragDropTouch(); // singleton
    // constants
    DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts
    DragDropTouch._OPACITY = 0.5; // drag image opacity
    DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click
    DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
    DragDropTouch._ISPRESSHOLDMODE = false; // decides of press & hold mode presence
    DragDropTouch._PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected
    DragDropTouch._PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing
    DragDropTouch._PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts
    // copy styles/attributes from drag source to drag image element
    DragDropTouch._rmvAtts = 'id,class,style,draggable'.split(',');
    // synthesize and dispatch an event
    // returns true if the event has been handled (e.preventDefault == true)
    DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
    DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');
    DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));


/***/ }),

/***/ 6192:
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(function () {
    return qrcode;
}));


/***/ }),

/***/ 5666:
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ 7905:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof __webpack_require__.g === 'undefined' ? window : __webpack_require__.g;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);


/***/ }),

/***/ 5301:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./GameBoard.js": 4696,
	"./Hand.js": 2169,
	"./Hand/getClearHandDoubles.js": 9064,
	"./Hand/isCalling.js": 6527,
	"./Hand/isMahjong.js": 5867,
	"./Hand/score.js": 839,
	"./Hand/syncContents.js": 974,
	"./Match.js": 9458,
	"./Popups.js": 4376,
	"./Pretty.js": 4810,
	"./RoomManager.js": 2342,
	"./RoomManager/SettingsMenu.js": 7537,
	"./Sequence.js": 7793,
	"./StateManager.js": 3642,
	"./Tile.js": 2946,
	"./TileContainer.js": 502,
	"./Wall.js": 6212,
	"./index.js": 2352,
	"./universalLinks.js": 819
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 5301;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(2352);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map
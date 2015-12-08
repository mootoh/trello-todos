// Fetch all Checklist items from all boards belong to you
function list(id, lists) {
  var found = lists.filter(function(list) {
    return list.id == id;
  });
  if (found.length > 0) {
    return found[0];
  } else {
    return null;
  }
}

function card(id, cards) {
  var found = cards.filter(function(card) {
    return card.id == id;
  });
  if (found.length > 0) {
    return found[0];
  } else {
    return null;
  }
}

function dumpCheckItems(board) {
  board.checklists.forEach(function(checklist) {
    checklist.checkItems.forEach(function(item) {
      if (item.state == 'complete') return;
      var cd = card(checklist.idCard, board.cards);
      var lst = list(cd.idList, board.lists);
      console.log([board.name, lst.name, cd.name, checklist.name, item.name].join(' - '));
    });
  });
}

function retrieve() {
  var Trello = require("node-trello");
  var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

  trello.get("/1/members/me/boards", {
    filter: "open"
  }, function(err, boards) {
    if (err) throw err;

    boards.forEach(function(bd) {
      trello.get('/1/boards/' + bd.id, {
        checklists: "all",
        lists: "all",
        cards: "all"
      }, function(err2, board) {
        if (err2) throw err2;
        dumpCheckItems(board);
      });
    });
  });
}

retrieve();

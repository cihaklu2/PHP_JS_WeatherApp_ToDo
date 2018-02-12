// Modernizr localStorage test method
var hasLocalStorage = (function() {
  var v = new Date();
  try {
    localStorage.setItem(v, v);
    localStorage.removeItem(v);
    return true;
  } catch(e) {
    return false;
  }
}());

;(function(root) {
  var ArraySortComparers = {
    /**
          Natural sorting algorithm. Much slower than a regular alphanumeric sort, but this
          one sorts like we as a human being would. 

          usually: 1, 10, 100, 2, 3, 30, 4, 40
          natural: 1, 2, 3, 4, 10, 30, 40, 100
        */
    naturalAlphaNumeric: function(a, b) {
      function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
      }

      // lower-case comparison!
      var aa = chunkify((a || '').toLowerCase());
      var bb = chunkify((a || '').toLowerCase());

      for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]), d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            return c - d;
          } else return (aa[x] > bb[x]) ? 1 : -1;
        }
      }
      return aa.length - bb.length;
    },

    naturalAlphaNumericCase: function(a, b) {
      function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
      }

      // case sensitive comparison!
      var aa = chunkify(a);
      var bb = chunkify(b);

      for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]), d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            return c - d;
          } else return (aa[x] > bb[x]) ? 1 : -1;
        }
      }
      return aa.length - bb.length;
    }
  };

  root.ArraySortComparers = ArraySortComparers;
}(window));


;(function(root) {
  var FeatureException = function(message) {
    this.name       = "FeatureException";
    this.message    = message;
  };

  var TodoList = function(storageId) {
    if(typeof(storageId) === "string") {
      this.storageId          = storageId;
      this.storageSupported   = hasLocalStorage;
      this.todo               = this.generateDefaultTodo();

      if(!this.storageSupported) {
        throw new FeatureException("localStorage is not supported by this browser");
      }
    } else {
      throw new TypeError("storageId must be a name of type string!");
    }
  };

  var p = TodoList.prototype;

  p.generateDefaultTodo = function() {
    return {list: [], idGenerator: 0, name: this.storageId};
  };

  p.reload = function() {
    var todo = def = this.generateDefaultTodo();
    var storage = localStorage.getItem(this.storageId);

    if(storage) {
      try {
        todo = JSON.parse(storage);
        if(typeof(todo) !== "object" || typeof(todo.list) !== "object") {
          todo = def;
        }
      } catch (e) {
        return;
      }
    }

    this.todo = todo;
    this.sort();
  };

  p.save = function() {
    localStorage.setItem(this.storageId, JSON.stringify(this.todo));
    this.reload();
  };

  p.sort = function() {
    if(this.todo.list.length > 0) {
      this.todo.list.sort(function(a, b) {
        if(b.priority === a.priority) {
          return ArraySortComparers.naturalAlphaNumeric(a.description, b.description);
          /* regular alphanumeric sort
                        if(a.description < b.description) {
                            return -1;
                        } else if(a.description > b.description) {
                            return 1;
                        } 

                        return 0;
                    */
        }

        // primary sort, sort by priority
        return b.priority - a.priority; 
      });   
    }
  };

  p.findItem = function(id) {
    var index = -1;

    for(var i = 0; i < this.todo.list.length; i++) {
      if(this.todo.list[i].id == id) {
        index = i;
      }
    }

    return index;        
  };

  p.addItem = function(item) {
    item.id = this.todo.idGenerator++;
    this.todo.list.push(item);
  };

  p.removeItem = function(id) {
    var index = this.findItem(id);
    if(index !== -1) {
      this.todo.list.splice(index, 1);
    }
  };

  p.setItemChecked = function(id) {
    var index = this.findItem(id);
    if(index !== -1) {
      this.todo.list[index].checked  = true;
      this.todo.list[index].priority = -1;
    }
  };

  p.removeChecked = function() {
    if(this.todo.list.length > 0) {
      for(var i = (this.todo.list.length - 1); i >= 0; i--) {
        if(this.todo.list[i].checked) {
          this.todo.list.splice(i, 1);
        }
      }
    }
  };

  p.getItems = function() {
    return this.todo.list;
  };

  p.reset = function() {
    this.todo = this.generateDefaultTodo();
  };

  root.FeatureException = FeatureException;
  root.TodoList = TodoList;
}(window));


if(!hasLocalStorage) {
  alert("This browser does not support localStorage!");
} else {
   $(function() {
    var todo = new TodoList("todoItems2");
    todo.reload();

    var $todo = $('#list');

     var $itemNone = $('div.none').clone();

    var refreshItems = function() {
      todo.reload();
      var items = todo.getItems();

      $todo.html('');
      if(items && items.length > 0) {
        for(var i = 0; i < items.length; i++) {
          var $nieuwElement = $('<div class="item" data-id=""></div>');
          $nieuwElement.text(items[i].description);
          $nieuwElement.attr('data-id', items[i].id);
          $nieuwElement.addClass('priority'+ items[i].priority);

          var $deleteElement = $('<span class="remove"><i class="fa fa-remove fa-fw"></i></span>');

          $deleteElement.appendTo($nieuwElement);
          if(!items[i].checked) {
            var $checkElement = $('<span class="check"><i class="fa fa-check fa-fw"></i></span>');
            $checkElement.appendTo($nieuwElement);
          }

          $nieuwElement.appendTo($todo);
        }
      } else {
        $itemNone.appendTo($todo);
      }
    };

    $todo.on('click', 'div.item .remove', function() {
      var $row   = $(this).closest('div.item');
      var id     = $row.attr('data-id');
      todo.reload();

      if(confirm("Opravdu chcete odstranit tuto položku ze seznamu?")) {
        todo.removeItem(+id);
        todo.save();
        refreshItems();
      }

      return false;
    });

    //  on-click event listener pro všechny budoucí položky
    $todo.on('click', 'div.item .check', function() {
      var $row   = $(this).closest('div.item');
      var id     = $row.attr('data-id');
      todo.reload();

      todo.setItemChecked(+id);
      todo.save();
      refreshItems();

      return false;
    });

    refreshItems();

    // provede se po stisknutí submit
    var $formular = $('#add form');
    $formular.submit(function() {
      var $label1 = $('label[for="description"]', $formular);
      var $input1 = $('input[name="description"]', $formular);
      var $input2 = $('select[name="priority"]', $formular);
      $label1.css({color: ''});
      $input1.css({borderColor: ''});

      var description = $input1.val();
      var priority    = $input2.val();

      if(description.trim() !== "") {
        todo.reload();

        todo.addItem({
// přidat objekt do pole todo,
            // s popisem pole a hodnotou
            // z popisu a priority pole
            // s hodnotou mimo priority. prioritou
            // byl nejprve převeden z řetězce na
            // 'číslo' o plusu, který vidíte
          description: description,
          priority:    +priority
        });

        todo.save();

        refreshItems();
      } else {
        $label1.css({color: '#f00'});
        $input1.css({borderColor: '#f00'});
      }

      $input1.val('');
      $input2.val('3');


      return false; 
    });

    $('input[name="reset"]', $formular).click(function() {
      todo.reset();
      todo.save();
      refreshItems();
      return false;
    });

    $('input[name="clear"]', $formular).click(function() {
      todo.removeChecked();
      todo.save();
      refreshItems();
    });
  });
}
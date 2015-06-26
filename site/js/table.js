function fm_table(name) {

  this.name = name;
  this.offset = 0;

  this.make_prms = function () {
    var attr = $("[fm-name]");
    var s = "tm=" + new Date().getTime();
    for (var i = 0; i < attr.length; i++) {
      s += "&" + attr[i].getAttribute("fm-name");
      s += "=" + encodeURIComponent(attr[i].value);
    }
    return s;
  }
  this.show = function () {
    var count = 10;

    var self = this;
    var url = "/" + this.name + ".page?offset=" + this.offset + "&count=" + count + "&tm=" + new Date().getTime();
    load_async_json(url, function (data) {
      if (data.result) {
        var info = id("#info");
        if (data.msg.length == 0) {
          if (info) {
            info.innerHTML = "last records";
          }
          return;// self.show_add_note();
        }
        fm_set_main_content(generator.gen(data.msg, name));
        if (info) {
          info.innerHTML = "records:" + self.offset;
        }
        fm.dropdown_hide();
      }
      else {
        alert(data.msg);
      }
    });
  }
  this.edit = function (ident) {
    var self = this;
    load_async_json("/" + name + ".edit?tm=" + new Date().getTime() + "&id=" + ident, function (data) {
      if (data.result) {
        fm_set_main_content(generator.gen(data.msg[0], name + "-edit"));
      }
      else {
        alert(data.msg);
      }
    });
  };
  this.show_add = function () {
    fm_set_main_content(generator.gen(null, name +"-add"));
  }
  this.show_offset = function (delta) {
    this.offset += parseInt(delta);
    if (this.offset < 0) this.offset = 0;
    this.show();
  };
  this.add = function (ident) {
    
    var self = this;
    post(name + ".add?",  this.make_prms(), function (data) {
      if (data.result) {
        self.show();
      }
      else {
        alert(data.msg);
      }
    });
  };
  this.update = function (ident) {
    var self = this;
    post(name + ".update?", "id=" + ident + this.make_prms(), function (data) {
      if (data.result) {
        self.show();
      }
      else {
        alert(data.msg);
      }
    });
  };
  this.delete = function (ident) {
    var self = this;
    load_async_json("/" + name + ".delete?id=" + ident, function (data) {
      if (data.result) {
        self.show();
      }
      else {
        alert(data.msg);
      }
    
    });
  }
}// end of class
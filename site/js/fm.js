HTMLElement.prototype.removeClass = function (remove) {
  var newClassName = "";
  var i;
  var classes = this.className.split(" ");
  for (i = 0; i < classes.length; i++) {
    console.log(classes[i]);
    if (classes[i] !== remove) {
      newClassName += classes[i] + " ";
    }
  }
  this.className = newClassName;
}



function fm_viewer(ident) {
  this.id = ident;
  this.files = [];
  this.index = 0;
  this.reset = function () {
    this.files = [];
    this.index = 0;
  };
  this.reg = function (file) {
    this.files.push(file);
  };
  this.play = function (i) {
    var tr = id("#tr" + this.index);
    if (tr) {
      tr.className = "text-default";
    }
    var elem = id(this.id);
    //elem.src = 'get.file?file=' + fm.join_path() + this.files[i].name;
    elem.src = fm.join_path() + this.files[i].name;
    elem.play();
    this.index = i;
    tr = id("#tr" + this.index);
    if (tr) {
      tr.className = "text-primary";
    }
  };
  this.hl = function () {
    var tr = id("#tr" + this.index);
    if (tr) {
      tr.className = "text-primary";
    }
  };
  this.sort = function () {
    this.files.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
      return 0;
    });
  };
  this.next = function(){
    var i = this.index + 1;
    if (i >= this.files.length - 1) {
      i = 0;
    }
    this.play(i);
  }
}

var lng = {
  ef: {
    worning: "Предупреждение",
    folder: "Папка",
    is_empty: "пустая.",
    can: "Вы можете ",
    create: "Создать подпапку",
    upload: "Выгрузить файла на сервер",
    or: "или",
    goback:"Выйти из папки"
  }
};

var img = {
  images: [],
  index : 0,
  image: null,
  elem_index: null,
  elem_count: null,
  elem_caption: null,
  path : null
, reg: function (file) {
  this.images.push(file);
}
, find: function () {
  if (this.image == null) {
    this.image = id("#img-view");
    this.elem_index = id("#img-index");
    this.elem_count = id("#img-count");
    this.elem_caption = id("#img-caption");
  }
}
, reset: function (path) {
  this.path = path;
  this.index = 0;
  this.images = [];
  this.image = null;
}
, first: function () {
  this.find();
  this.index = 0;
  this.refresh();
}
, last: function () {
  this.find();
  this.index = this.images.length - 1;
  this.refresh();
}
, next: function () {
  this.find();
  this.index++;
  if (this.index > this.images.length - 1) {
    this.index = 0;
  }
  this.refresh();
}
, prev: function () {
  this.find();
  this.index--;
  if (this.index < 0) {
    this.index = this.images.length - 1;
  }
  this.refresh();
}
,get_current : function(){
  var name = this.images[this.index];
  return fm.join_path() + name;

}
, refresh: function () {
  var name = this.images[this.index];
  var path = fm.join_path() + name;
  this.image.src = path;
  this.image.alt = this.images[this.index];
  this.elem_index.innerHTML = (this.index + 1);
  this.elem_count.innerHTML = this.images.length;
  this.elem_caption.innerHTML = name;

}
, refresh_by_name : function(name){
  for(var i = 0, count=this.images.length; i < count; i++){
    if(this.images[i] == name){
      this.index = i;
      this.refresh();
      return;
    }
  }
}
, show_modal : function(filename){
  var d =  document.getElementById("dd");
  generator.gen([],"i", "dd");
  img.find();
  img.refresh_by_name(decodeURIComponent(filename));
  //d.requestFullScreen();
}
,scale : 1
, zoomin:function(){
  //var d = document.getElementById("dd");
  //d.clientWidth += d.clientWidth *0.1;

  this.image.clientWidth += this.image.clientWidth *0.2;
}
,zoomout : function(){
//  var d = document.getElementById("dd");
//  d.clientWidth -= d.clientWidth *0.1;
  this.scale -= 0.5;
  this.image.style = "transform:scale(" + this.scale + ")";

 }
};
//         -----------------------------------
//                 fm
//-----------------------------------------------
var fm = {
  stack: [],
  is_popup_visible: false,
  consts: {
    main_content: "#fm-main-content"
  },
  state: {
    current: 0,
    upload: 1,
    create_folder: 2,
    navigator: 3
  },
  file_type: {
    unknown: 0,
    video: 1,
    audio: 2,
    document: 3,
    image: 4,
    html : 5
  }
, audio: new fm_viewer("audio")
, video: new fm_viewer("video")
, links: new fm_table("links")
, encode: function (s) {
  return encodeURIComponent(s);
}
, get_file_type: function (ext) {
  if ("pdf;doc;mobi;fb2;txt;epub;rtf;doc;".indexOf(ext + ';') >= 0) return this.file_type.document;
  if ("mp4;mov;3gp;ogg;avi;mkv;vob;".indexOf(ext + ';') >= 0) return this.file_type.video;
  if ("jpg;png;".indexOf(ext + ';') >= 0) return this.file_type.image;
  if ("mp3;3gpp;".indexOf(ext + ';') >= 0) return this.file_type.audio;
  if ("html;".indexOf(ext + ';') >= 0) return this.file_type.html;
  return this.file_type.unknown;
}
, errors: {
  create_folder: "specify the folder in which you want to create a subfolder",
  upload_select_folder: "specify the folder to which you want to upload files"
},
  foreach: function (obj, callback) {
    for (var i = 0, max = obj.length; i < max; i++) {
      var item = obj[i];
      callback(item, i);
    }
  }
, can_goback: function () {
  return (this.stack.length > 0);
}

, get_main_content: function () { return id(this.consts.main_content); }
, set_folder: function (folder) {
  if (folder !== "root") {
    if (folder === "..") {
      this.stack.pop();
    }
    else {
      this.stack.push(folder);
    }
    folder = this.stack.join('/');
    if (folder.length === 0) {
      folder = "root";
    }
  }
  else {
    this.stack = [];
  }
  this.is_popup_visible = false;
  return folder;
}
, join_path: function (decode) {
  var s = "";
  for (var i = 0, max = this.stack.length ; i < max; i++) {
    var x = this.stack[i];
    x = (x[x.length - 1] == '/') ? x.substr(0, x.length - 1) : x;
    s += (decode ? decodeURIComponent(x) : x) + '/';
  }
  return s;
}
, open_file: function (file) {
  var link = document.createElement("a");
  link.href = decodeURI(fm.join_path() + file);
  link.target = "_blank";
  link.click();
}
, open_site: function (url) {
  var link = document.createElement("a");
  link.href = "http://" + url;
  link.target = "_blank";
  link.click();
}
, download_file: function (file) {

  var link = document.createElement("a");
  link.download = decodeURI(file);
  link.href = decodeURIComponent(fm.join_path() + file);
  link.target = "_blank";
  link.click();
  //  fm_refresh();
}
, refresh_current: function () {

  switch (this.state.current) {
    case this.state.upload:
      if (this.stack.length === 0) {
        fm_refresh();
      }
      else {
        create_upload_form();
      }
      break;
    case this.state.create_folder:
      create_folder_form();
      break;
    case this.state.navigator:
      fm_refresh();
      break;
    default:
      break;
  }
}
, recreate_stack: function (max) {
  var new_stack = [];
  for (var i = 0; i < max; i++) {
    new_stack.push(this.stack[i]);
  }
  var folder = this.stack[max];
  this.stack = new_stack;
  return folder;
}
, show_ext_menu: function () {
  this.reset_notes();
  fm_set_main_content(generator.generate_one(null, "fm-ext-menu", null));
}
, show_servers: function () {
  var self = this;
  load_async_json("/get.servers?tm=" + new Date().getTime(), function (data) {
    if (data.result) {
      fm_set_main_content(generator.gen(data, "servers"));
    }
    else {
      fm_set_main_content(generator.generate_one(data.msg, "fm-mysql-error"));
      $("#myModal").modal();
      self.show_ext_menu();
    }
  });
}
, dropdown_hide: function (dropdown_name) {
  var drop = id(dropdown_name);//"#dropdown-left");
  if (drop) {
    drop.removeClass("open");
  }
}
,hide_left_popup : function(){
  this.dropdown_hide("#dropdown-left");
}
, hide_right_popup: function () {
  this.dropdown_hide("#dropdown-right");
}
, offset: 0
, last_notes: false
, reset_notes: function () {
  this.offset = 0;
  this.last_notes = false;
}
, show_notes_offset: function (delta) {

  
  this.offset += parseInt(delta);
  if (this.offset < 0) this.offset = 0;
  this.show_notes();
}
, show_notes: function () {
  var count = 10;

  
  var self = this;
  var url = "/notes.get?offset=" + this.offset + "&count=" + count + "&tm="+ new Date().getTime();
  load_async_json(url, function (data) {

    if (data.result) {
      var info = id("#notes-info");
      if (data.msg.length == 0) {
        if (info) {
          self.last_notes = true;
          info.innerHTML = "last records";
        }
        return;// self.show_add_note();
      }
      fm_set_main_content(generator.gen(data.msg, "notes"));
      self.last_notes = false;
      if (info) {
        info.innerHTML = "records:" + self.offset;
      }
      self.dropdown_hide("#dropdown-left");
    } else {
      fm_set_main_content(generator.generate_one(data.msg, "fm-mysql-error"));
      $("#myModal").modal();
    }

  });
}
, delete_note: function (ident) {
  var self = this;
  load_async_json("/notes.delete?id=" + ident, function (data) {
    if (data.result) {
      self.show_notes();
    }
    else {
      alert(data.msg);
    }
    
  });
}
, save_new_note: function (txt) {
    var elem = id("#txt");
    if (elem.value.length == 0) {
      elem.value = "Введите текст...";
      return;
    }
    var self = this;
    post("note.add?", "txt=" + encodeURI(elem.value), function (data) {
      if (data.result) {
        self.show_notes();
      }
      else {
        elem.value = data.msg + "\n\n" +elem.value;
      }
    });
}
, show_add_note: function () {
  fm_set_main_content(generator.gen(null, "add-note"));
}
, show_edit_note: function (ident) {
  var self = this;
  load_async_json("/notes.note?tm="+ new Date().getTime() + "&id=" + ident, function (data) {
    if (data.result) {
      fm_set_main_content(generator.gen(data.msg[0], "edit-note"));
    }
    else {
      alert(data.msg);
    }
  });
}
, update_note: function (ident) {
  var elem = id("#txt");
  var self = this;
  post("note.update?", "id=" + ident + "&txt=" + encodeURI(elem.value), function (data) {
    if (data.result) {
      self.show_notes();
    }
    else {
      elem.value = data.msg + "\n\n" + elem.value;
    }
  });

}
};


function get_file_ext(file) {
  var ext = "";
  for (var i = file.length - 1; i > -1; i--) {
    if (file[i] === '.') break;
    ext = file[i] + ext;
  }
  return ext.toLowerCase();
}
function create_image_view(parent, filename) {
 return img.show_modal(filename);

  fm_set_main_content(generator.gen(img.images, "images"));
  img.find();
  img.refresh_by_name(decodeURIComponent(filename));
//  return;
//  load_async("/img_view.html", function (text) {
//    parent.innerHTML = text;
//    var elem = id("#img-view");
//    elem.onload = function () {
//      var k = this.height / this.width;
//    }
//    img.find();
//    img.refresh();
//});
}

function create_mp3_player(parent, filename) {

 fm_set_main_content(
generator.generate_one(fm.audio.files, "fm-audio-header", 0)
+ generator.generate(fm.audio.files, "fm-audio-body", 0)
+ generator.generate_one(fm.audio.files, "fm-audio-footer")
  );
 fm.audio.play(0);
}

function create_vidio_view(parent, filename) {

 fm_set_main_content(
    generator.generate_one(fm.video.files, "fm-video-header",0)
    + generator.generate(fm.video.files, "fm-video-body", 0)
    + generator.generate_one(fm.video.files, "fm-video-footer")
  );
  fm.video.play(0);
}
function create_upload_form() {

  fm.state.current = fm.state.upload;

  if (fm.stack.length == 0 ){
    fm_show_error(fm.errors.upload_select_folder) 
  }
  fm_set_main_content(generator.generate_one(null, "fm-upload-form"));
  fm.hide_right_popup();
  //control_upload_files.click();
}
function create_folder_form() {

  if (fm.stack.length == 0) {
    fm_show_error(fm.errors.create_folder);
  }
  else {
    fm_set_main_content(generator.generate_one(null, "fm-create-folder"));
  }
  fm.hide_right_popup();
}
function fm_get_file(file) {

  var elem = fm.get_main_content();
  var ext = get_file_ext(file);
  var command = "get.file?file=" + fm.join_path() + file;

  var type = fm.get_file_type(ext);
  switch (type) {
    case fm.file_type.document:
      return fm.open_file(file);
    case fm.file_type.video:
      return create_vidio_view(elem, command);
    case fm.file_type.image:
      return create_image_view(elem, file);
    case fm.file_type.audio:
      return create_mp3_player(elem, command);
    case fm.file_type.html:
      return fm.open_file(file);
    default:
      elem.innerHTML = "unsupported file extention " + ext;
      break;
  }
  
}
function fm_refresh() {
  try {
    fm.state.current = fm.state.navigator;
    var folder = (fm.stack.length > 0) ? fm.recreate_stack(fm.stack.length - 1) : "root";
    //folder = encodeURI(folder);
    //alert('refresh:' + folder);

    init_document(folder);
    fm.dropdown_hide("#dropdown-right");
  } catch (err) {
    alert('error refresh ' + err);
  }
}
function fm_prevent_events(e) {
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
    e.stopPropagation();
  } else {
    e.returnValue = false;
    e.cancelBubble = true;
  }
}
function fm_set_main_content(html) {
  var elem = fm.get_main_content();
  elem.innerHTML = html;
}
function fm_show_error(text) {
  load_async("/error.html", function (data) {
    fm_set_main_content(data);
    id("#error-text").innerHTML = text;
  });
}
function fm_create_folder() {

  var elem = id("#input-folder-name");
  fm.state.current = fm.state.create_folder;

  if (elem.value.length < 1) {
    fm_show_error("folder name is empty!");
    return;
  }
  var folder_name = encodeURI(elem.value);
  load_async_json("/mkdir?folder=" + fm.join_path() + "&name=" + folder_name, function (data) {
    if (data.result) {
      fm_refresh();
    }
    else {
      alert(data.name + "\n" + data.msg);
    }
  });
  fm.get_main_content().innerHTML = "working...";
}
function fm_refresh_by_index(index) {
  var folder = fm.recreate_stack( parseInt(index));
  init_document(folder);
}

function make_popup() {

  if (fm.is_popup_visible) {
    fm.is_popup_visible = false;
    fm_refresh();
    return;
  }
  fm.is_popup_visible = true;
  var elem = fm.get_main_content();

  var html = generator.generate_one(fm.stack, "fm-popup-header", 0);
  html += generator.generate(fm.stack, "fm-popup-body");
  html += generator.generate_one(fm.stack, "fm-popup-footer",0);
  elem.innerHTML = html;
  fm.dropdown_hide("#dropdown-right");
}
function make_breadcrumbs() {

  var html = generator.generate_one(fm.stack, "fm-bread-header")
   + generator.generate(fm.stack, "fm-bread-body")
   + generator.generate_one(fm.stack, "fm-bread-footer");

  id("#td-path").innerHTML = html;

}
function fm_delete_file(file) {
  confirm("delete " + file);
}

function fm_find_data_method(elem) {
  var method = null;

  while(!method){
    method = elem.getAttribute("data-method");
    if (method) {
      return { elem:elem , method: method, args: elem.getAttribute("data-args") };
    }
    elem = elem.parentElement;
    if (elem == null) return method;
  }
}
function fm_on_click(e) {

  e = e || window.event;
  var target = e.target || e.srcElement;

  var x = fm_find_data_method(target);
  if (!x) {
    return;
  }
  if (x.method) {
    if (x.args) {
      x.args = x.args.split(',');
    }
    x.method = x.method.split('.');
    if (x.method.length === 1) {
      window[x.method[0]].apply(this, x.args);
    }
    else if (x.method.length === 2) {
      var obj = eval(x.method[0]);
      window[x.method[0]][x.method[1]].apply(obj, x.args);
    }
    else {
      var obj = eval(x.method[0] + "." + x.method[1]);
      window[x.method[0]][x.method[1]][x.method[2]].apply(obj, x.args);
    }
    fm_prevent_events(e);
  }
}

function init_document(folder) {

  try {

    //alert(folder);
    history.pushState(null, null, '/');

    fm.state.current = fm.state.navigator;
    folder = fm.set_folder(folder);
    make_breadcrumbs();

    fm.video.reset();
    fm.audio.reset();
    
    load_async_json("get.folder?folder=" + encodeURIComponent(folder) + "&tm=" +(new Date).getTime(), function (data) {
      
      if (data.length === 0) {
        return fm_set_main_content(generator.generate_one(decodeURIComponent(folder), "fm-empty-folder", null));
      }
      data.sort(function (a, b) { return b.d - a.d; });

      img.reset(fm.join_path());
      var html = generator.generate_one(null, "fm-list-header");

      fm.foreach(data, function (item, i) {

        html += generator.generate_one(item, (item.d ? "fm-list-folder-body" : "fm-list-file-body"), i);

        var filename = item.name;
        var ext = get_file_ext(filename);
        var type = fm.get_file_type(ext);
        switch (type) {
          case fm.file_type.document:
            break;
          case fm.file_type.video:
            fm.video.reg(item);
            break;
          case fm.file_type.image:
            img.reg(filename);
            break;
          case fm.file_type.audio:
            fm.audio.reg(item);
            break;
          default:
            break;
        }
      });

      html += generator.generate_one(null, "fm-list-footer");
      fm.get_main_content().innerHTML = html;
   });
  }
  catch (err) {
    alert(err);
  }
}





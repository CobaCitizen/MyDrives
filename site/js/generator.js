// ----------- GENERATOR ---------------- 
var generator = {
  makets: null
, BEGIN: "<!--#"
, END: "-->"
, parse: function (text) {
  var s, data = [];

  do {
    var i = text.indexOf("{{");

    if (i !== -1) {
      s = text.substr(0, i);
      text = text.substr(i + 2);
      data.push({ "text": true, "value": s });

      i = text.indexOf("}}");
      if (i !== -1) {
        s = text.substr(0, i);
        data.push({ "text": false, "value": s });
        text = text.substr(i + 2);
      }
    }
  } while (i !== -1);

  if (text.length > 0) {
    data.push({ "text": true, "value": text });
  }
  return data;
}
, load: function (onsuccess) {
  var self = this;

  load_async("/data/bread.html", function (text) {

    self.makets = [];
    var arr = text.split(self.BEGIN);
    for (var i = 0, count = arr.length; i < count; i++) {
      var item = arr[i];
      var n = item.indexOf(self.END);
      if (n !== -1) {
        var name = item.substr(0, n);
        var body = item.substr(n + self.END.length);
        self.makets[name] = { bode: body, p: self.parse(body) };
      }
    }
    //// debug
    //for (var item in self.makets) {
    //  console.log(self.makets[item]);
    //}
    if (onsuccess) onsuccess();
  });
}
, generate_one: function (item, maket_name, index) {

  var html = "";
  var maket = (maket_name instanceof Object ? maket_name : this.makets[maket_name].p);

  var i = 0, count = maket.length;
  while (i < count) {
    var line = maket[i];
    if(line.text){
      html += line.value;
    }
    else {
      if (line.value[0] === '*') {
        eval(line.value.substr(1));
      }
      else{
        html += eval(line.value);
      }
    }
    i++;
  }
  return html;
}
, generate: function (data, maket_name) {
  var m = this.makets[maket_name];
  
  var maket = this.makets[maket_name].p;
  var html = "";

  if (!data) return;
  var n = 0, max = data.length;

  while (n < max) {
    var item = data[n];
    html += this.generate_one(item, maket, n);
    n++;
  }
  return html;
}
, gen: function (data, maket) {
  return this.generate_one(data, "fm-" + maket + "-header", 0)
    + this.generate(data, "fm-" + maket + "-body", 0)
    + this.generate_one(data, "fm-" + maket + "-footer", 0);
}
};

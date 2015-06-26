
///////////////////////////////////////////////////////////////////////////////////////////////////
var COBA_UPLOAD_FILES = [];
var coba_upload_cancel = false;

function coba_enable_upload()
{
  //fm_set_main_content(generator.generate_one(null,"fm-upload-complete"));
  fm_refresh();
}

function coba_format_bytes(bytes)
{
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " K";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " M";
  else return (bytes / 1073741824).toFixed(2) + " G";
}

function coba_create_upload_info(file) {
  var control = document.getElementById("control_progress");

  var tr = document.createElement("tr");

  var td = document.createElement("td");
  //td.className = "col-xs-1";
  td.innerText = file.name;
  tr.appendChild(td);
  td.setAttribute("colspan", "2");
  control.appendChild(tr);

  tr = document.createElement("tr");

  td = document.createElement("td");
  //td.style.textAlign = "right";
  td.innerText = coba_format_bytes(file.size);
  //td.className = "col-xs-6";
  tr.appendChild(td);

  td = document.createElement("td");
 // td.style.textAlign = "right";
  td.innerText = "0%";
  //td.className = "col-xs-3";
  tr.appendChild(td);

  control.appendChild(tr);

  return td;
}

function coba_upload_part(file, blobs, poss, first, dv)
{
  var blob = blobs.shift();
  var pos = poss.shift();
 // var file_name = encodeURIComponent(coba_get_remote_path() + file.name);
 // var file_name = join_path(true) + file.name;
  
  var info =
         "name=" + encodeURI(fm.join_path() + file.name)
       + "&type=" + file.type
       + "&size=" + (blob ? blob.size : -1)
       + "&filesize=" + file.size
       + "&start=" + (pos ? pos[0] : -1)
       + "&end=" + (pos ? pos[1] : -1);

  var action = (first ? 'open' : (blob ? 'continue' : 'close'));
  info += "&action=" + action;

  var client = new XMLHttpRequest();
  client.ontimeout = function (e) {
     alert('client timeout ...')
  };

//  client.open('upload', action, true);
  client.open('post', action, true);
  client.onreadystatechange = function () {

    if (client.readyState == 4 && client.status == 200) {

      var x = eval("x=" + client.responseText);
      if (x.result == "ok")
      {
        dv.innerHTML = ((x.offset * 100) / file.size).toFixed(2) + " %";

        if (x.msg == 'close')
        {
          delete xhr;
      //    dv.innerHTML = "100%";
          COBA_UPLOAD_FILES = COBA_UPLOAD_FILES.filter(function (el) {
                 return el.file !== file;
          });
          if(COBA_UPLOAD_FILES.length == 0)
          {
            coba_enable_upload();
          }
          else { //ww
            coba_upload_files();
          }
        }
        else {
          coba_upload_part(file, blobs, poss, false,dv);
        }
      }
      else {
        alert('error send file ' + x.msg);
      }
    }
  }
  //
  
 // var offset = (pos &&  pos[1]) ? pos[1] : file.size;
  //dv.innerHTML = ((offset * 100) / file.size).toFixed(3) + " %" ;

  client.setRequestHeader('content-type', file.type)
  client.setRequestHeader('coba-action', 'UploadFile');
  client.setRequestHeader('coba-file-info', info);

  if (blob) {
    client.send(blob);
  }
  else {
    client.send();
  }
  //return xhr;
}


function coba_upload_file(file,td)
{

  var blobs = [];
  var poss = [];

  //var bytes_per_chunk = 1024 * 1024;
  var bytes_per_chunk = 1024 * 512;
  var start = 0;
  var end = bytes_per_chunk;
  var size = file.size;

  while (start < size)
  {
    poss.push([start, end]);
    blobs.push(file.slice(start, end));
    start = end;
    end = start + bytes_per_chunk;
  }
  coba_upload_part(file, blobs, poss, true, td);
}

function coba_upload_files() {
  try {
    if (COBA_UPLOAD_FILES.length == 0) {
      fm_show_error("select files to upload!");
      return;
    }
    var i = 0;

    var file = COBA_UPLOAD_FILES[i].file;
    var td = COBA_UPLOAD_FILES[i].td;
    coba_upload_file(file, td);
  }
  catch (err) {
    alert(err);
  }
}

function coba_upload_files2()
{
  try{
    if (COBA_UPLOAD_FILES.length == 0)
    {
      fm_show_error("select files to upload!");
      return;
    }
    for (var i = 0; i < COBA_UPLOAD_FILES.length; i++) {
      var file = COBA_UPLOAD_FILES[i].file;
      var td = COBA_UPLOAD_FILES[i].td;
      coba_upload_file(file, td);
    }
  }
  catch (err) {
    alert(err);
  }
}


/////////////////////////////////////////////////////////
function coba_upload_info(files)
{
  for (var i = 0; i < files.length; i++)
  {
    var file = files[i];
    var td = coba_create_upload_info(file);
    COBA_UPLOAD_FILES.push({file:file,td:td});
  }
}
function coba_upload_show_info()
{
  var control = document.getElementById("control_upload_files");
  var files = control.files;
  if (files && files.length > 0)
  {
    coba_upload_info(files);
  }
  control.value = [];
}


$(document).ready(function(){
	var mapHeight =$(window).height() - 100;//To Set the Height Map layout
	var pageHeight=$(window).height()-44;//To detect device height
	var frameHeight=(pageHeight/100)*30;//To Set Picture Frame Height
	var dbName;
	
	//Method to load office site in Inappbrowser
	function webShower(){
		var officeSite=window.open('http://www.cgvakindia.com/','_blank','location=yes','closebuttoncaption=Ok','toolbarposition=top');
	}

	//Method to open Camera
	function openCamera(){
		var camOptions={
			quality : 75,
  			destinationType : Camera.DestinationType.FILE_URI,
  			sourceType : Camera.PictureSourceType.CAMERA,
  			allowEdit : true,
  			encodingType: Camera.EncodingType.JPEG,
  			targetWidth: 110,
  			targetHeight: frameHeight  
		}
		navigator.camera.getPicture(onCamClick,onCamClose,camOptions);
	}
	//Method called after CameraSuccess
	function onCamClick(imageURI){
		$("#picFrame").html("<img src='"+imageURI+"'id='picMan'>");
		var fileName=$("#picMan").attr('src');
		
	}
	//Method Called after CameraFailure
	function onCamClose(){
		alert("Camera Error");
	}

	//Method to Create DB and Table
	function dbSettings(){
		dbName.transaction(function(tx){
			tx.executeSql("create table if not exists cgptable(pid primary key integer,pname text,pdes text,pprice real)");
			alert("Created Table");
		});
	}

	document.addEventListener('deviceready',function(){

	//Creates DB
		 dbName= window.sqlitePlugin.openDatabase({name: "cgp.db"});
		dbSettings();
	//Opens Camera
	$("#picFrame").tap(openCamera);

	//Displays info-page
	$("#informer").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#info-page");
		window.location.reload();
	});

	//Displays add-page width adjusted heights
	$("#adder").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#add-page");
		
		$("#picFrame,#picNameFrame").css("height",frameHeight+"px");//SPecifies height for the PicFrame and NameFrame
		$("#picDescFrame").css("height",(pageHeight/100)*50+"px");//Specifies the height for the PicDescription
				
	});

	//Invokes webShower method
	$("#weber").tap(webShower);
	//Changes the height of the Map

	$(document).on("pageinit","#info-page",function(){
	$("#mapFrame").css("height",mapHeight+"px");	
});

	//Device Ready
	});
	//Loaded all data into DOM
});
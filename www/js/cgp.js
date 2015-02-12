$(document).ready(function(){
	var mapHeight =$(window).height() - 100;//To Set the Height Map layout
	var pageHeight=$(window).height()-44;//To detect device height
	var frameHeight=(pageHeight/100)*30;//To Set Picture Frame Height
	var dbName;
	
	//Method to load office site in Inappbrowser
	function webShower(){
		var officeSite=window.open('http://www.cgvakindia.com/','_blank','location=yes','closebuttoncaption=Ok','toolbarposition=top');
	}

			/**Starting of Camera Methods**/
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
			}
	//Method Called after CameraFailure
	function onCamClose(){
		alert("Camera Error");
	}

			/**End of Camera Methods**/

			/**Starting of DB Methods**/
	//Method to Create DB and Table
	function dbSettings(){
		dbName.transaction(function(tx){
			//tx.executeSql("drop table if exists cgptable");
			tx.executeSql("create table if not exists cgptable(pid integer primary key ,pname text,pdes text,pprice real,ppicpath text)");
			
		});
	}

	//Method to Store data in Table
	function saveProduct(){
		
		var sname=$("#productNameBox").val();
		var sdes=$("#productDescBox").val();
		var sprice=$("#picPriceBox").val();		
		var spath=$("#picMan").attr('src');
		
		dbName.transaction(function(tx){
			tx.executeSql("insert into cgptable(pname,pdes,pprice,ppicpath) values(?,?,?,?)",[sname,sdes,sprice,spath]);			
		});
		$("#productList").html(" ");
		$(":mobile-pagecontainer").pagecontainer("change","#list-page");
		readProducts();
	}

	//Method to list Products
	function listProducts(tx,results){
		
		for(var i=0;i<results.rows.length;i++){
			var row=results.rows.item(i);
			$("#productList").append("<li id='"+row.pid+"' class='pl'><a href='#'><img src='"+row.ppicpath+"'><h2>"+row.pname+"</h2></a></li>");
		}
		$("#productList").listview("refresh");
	}

	//Method to read Products
	function readProducts(){
		
		dbName.transaction(function(tx){
			tx.executeSql("select * from cgptable",[],listProducts);			
		});
	} 


	

			/**Ending of DB Methods**/
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

	//Displays List Page	
	$("#lister").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#list-page");	
		$("#productList").html(" ");
		readProducts();
	});

	//Displays add-page width adjusted heights
	$("#adder").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#add-page");		
		$("#picFrame,#picNameFrame").css("height",frameHeight+"px");//SPecifies height for the PicFrame and NameFrame
		$("#picDescFrame").css("height",(pageHeight/100)*32+"px");//Specifies the height for the PicDescription
			
	});

	//Invokes webShower method
	$("#weber").tap(webShower);
	//Changes the height of the Map

	$(document).on("pageinit","#info-page",function(){
	$("#mapFrame").css("height",mapHeight+"px");	
});

	$("#savebtn").tap(saveProduct);
	//Device Ready
	});
	//Loaded all data into DOM
});
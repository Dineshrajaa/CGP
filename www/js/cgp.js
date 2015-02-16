$(document).ready(function(){
	var mapHeight =$(window).height() - 100;//To Set the Height Map layout
	var pageHeight=$(window).height()-44;//To detect device height
	var frameHeight=(pageHeight/100)*30;//To Set Picture Frame Height
	var dbName,uid,gid;
	
	
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
		};	
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

	function openEditCamera(){
		var camOptions={
			quality : 75,
  			destinationType : Camera.DestinationType.FILE_URI,
  			sourceType : Camera.PictureSourceType.CAMERA,
  			allowEdit : true,
  			encodingType: Camera.EncodingType.JPEG,
  			targetWidth: 110,
  			targetHeight: frameHeight  
		};
		navigator.camera.getPicture(onEditCamClick,onCamClose,camOptions);
	}

	function onEditCamClick(imageURI){
		$("#editPicFrame").html("<img src='"+imageURI+"'id='editPicMan'>");
	}

			/**End of Camera Methods**/

			/**Starting of DB Methods**/
	//Method to Create DB and Table
	function dbSettings(){
		dbName.transaction(function(tx){			
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
		$("#productList").html(" ");		
		dbName.transaction(function(tx){
			tx.executeSql("select * from cgptable",[],listProducts);			
		});
	} 

	//Method to edit products
	function editProduct(eid){		
		$(":mobile-pagecontainer").pagecontainer("change","#edit-page");		
		uid=eid;
		dbName.transaction(function(tx){
			tx.executeSql('select * from cgptable where pid = "'+uid+ '"', [],function(transaction,results){
				var row=results.rows.item(0);
				$("#editPicFrame").html("<img src='"+row.ppicpath+"'id='editPicMan'>");
				$("#editProductNameBox").val(row.pname);
				$("#editProductIdBox").val(row.pid);
				$("#editProductDescBox").val(row.pdes);
				$("#editPicPriceBox").val(row.pprice);
			});
		});
	}

	//Method to Update Data
	function updateProduct(){
		var upname=$("#editProductNameBox").val();
		var updes=$("#editProductDescBox").val();
		var uprice=$("#editPicPriceBox").val();
		var upath=$("#editPicMan").attr('src');
		dbName.transaction(function(tx){
				tx.executeSql("update cgptable set pname=?,pdes=?,pprice=?,ppicpath=? where pid='"+uid+"'",[upname,updes,uprice,upath]);
			});
		//$("#productList").html(" ");
		$(":mobile-pagecontainer").pagecontainer("change","#list-page");
		readProducts();
	}

	//Method to Delete Product
	$("#deletebtn").tap(function(){
		deleteProduct($("#editProductIdBox").val());
	});
	
	
	//Method to Delete Data
	function deleteProduct(did){
		alert("Do you want to Delete?");
		dbName.transaction(function(tx){
			tx.executeSql("delete from cgptable where pid=?",[did]);
		});
		$(":mobile-pagecontainer").pagecontainer("change","#list-page");
		readProducts();
	}
	

			/**Ending of DB Methods**/
	document.addEventListener('deviceready',function(){

	//Creates DB
		 dbName= window.sqlitePlugin.openDatabase({name: "cgp.db"});
		 
		dbSettings();
	//Opens Camera
	$("#picFrame").tap(openCamera);

	//Opens Edit Camera
	$("#editPicFrame").tap(openEditCamera);

	//Displays info-page
	$("#informer").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#info-page");
		window.location.reload();
	});

	//Displays List Page	
	$("#lister").tap(function(){
		//$("#productList").html(" ");
		$(":mobile-pagecontainer").pagecontainer("change","#list-page");
		readProducts();

	});

	//Displays add-page width adjusted heights
	$("#adder").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#add-page");		
		$("#picFrame,#picNameFrame").css("height",frameHeight+"px");//SPecifies height for the PicFrame and NameFrame
		$("#picDescFrame").css("height",(pageHeight/100)*32+"px");//Specifies the height for the PicDescription
		$("#picFrame,#productNameBox,#productDescBox,#picPriceBox").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from cgptable",[],function(tx,results){				
				$("#productIdBox").val(results.rows.length+1);
			});			
		});
			
	});

	//Invokes Update function
	$("#updatebtn").tap(updateProduct);
	//Invokes webShower method
	$("#weber").tap(webShower);
	//Changes the height of the Map

	$(document).on("pageinit","#info-page",function(){
	$("#mapFrame").css("height",mapHeight+"px");	
});

	//Displays the details of the selected Product to Edit	
	$(document).on("click","#productList li",function(){
				editProduct($(this).attr('id'));
				$("#editPicFrame,#editPicNameFrame").css("height",frameHeight+"px");//SPecifies height for the PicFrame and NameFrame
				$("#editPicDescFrame").css("height",(pageHeight/100)*32+"px");//Specifies the height for the PicDescription
		});

	

	$("#savebtn").tap(saveProduct);
	//Device Ready
	});
	//Loaded all data into DOM
});
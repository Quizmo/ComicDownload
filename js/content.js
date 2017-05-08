var r= $('<input type="button" id="btnDownload" class="button" value="Download"/>');

if($("#selectReadType option:selected" ).text() != 'All pages'){	
	$("#selectQuality").parent().append('<p><b>You must select All pages first to download as pdf..</b></p>');	
}else{
	$("#selectQuality").parent().append(r);
}

$( "#btnDownload" ).click(function() {
start = new Date().getTime();
var doc = new jsPDF("p", "mm", "a4");

var width = doc.internal.pageSize.width;    
var height = doc.internal.pageSize.height;

addImages(doc, width, height);

});

function createPdfFromMap(map, doc, width, height)
{
	var title = $(document).find("title").text().split('-')[0].replace(/(\r\n|\n|\r)/gm,"").replace(/\s/g, '');		
	var count = 0;
	
	$.each( map, function(index,value){		
		doc.addImage(value.val, 'JPEG', 0, 0, width, height);
		doc.addPage();		
		count++;
		if($(map).length > count)
		{				
			console.log('Added page ' + value.key);
		}
		else{		
			console.log('Done');
			doc.setFontSize(20);
			var center = (doc.internal.pageSize.width / 2);
			doc.text('The End!', center, 150, 'center');			
			doc.setFontSize(16);
			doc.text(window.location.href, center, 160, 'center');			
					
			
			doc.save(title + '.pdf');
			
			

		}	
	})

	
}

function addImages(doc, width, height){
	var count = 0;
	var masterList = [];
	
	$('#divImage > p').children('img').each(function( index ) {	
	
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.responseType = 'blob';
	xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {		
		var blob = new Blob([this.response], {type: 'image/jpeg'});		
		
		var reader = new window.FileReader();
		 reader.readAsDataURL(blob); 
		 reader.onloadend = function() {
			masterList.push({ key: index, val: reader.result })
			count++;
			if($('#divImage > p').children('img').length > count)
			{				
				console.log('Created nr. ' + count);
			}
			else{						
				masterList = masterList.sort(function(a, b) {
					return parseInt(a.key) - parseInt(b.key);
				});
				createPdfFromMap(masterList, doc, width, height);				
			}			
		  }		
	}
	}; 
	xhr.open("GET", $(this).attr('src'), true);
	xhr.send();	
	
});
	
}
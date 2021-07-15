const { PDFDocument, StandardFonts, PageSizes, rgb, PDFImage, PDFPage } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

  // Funcionalidades 
  let indice= [];
  let actualPageNumber = 1;

  const createPDF = async (options) => {
    indice = [];
    actualPageNumber = 1;
    console.log('Creando paginas...');
    const document = await generatePages(options.files, options.index)
    console.log('Se crearon todas las paginas')
  
      if (options.pageNumbers) {
        console.log('Agregando numeros de pagina ...');
        await addPageNumbers(document);
        console.log('Numeros de pagina agregados');
      }
  
      if (options.index) {
        console.log('Generando indice...');
        await addIndex(document);
       
        console.log('Indice generado');
      }
  
  
  
    return document;
  
  }

const addIndex = async (document) => {

  const SANGRIA = 100;
  const FROM_TOP = 100;


  // Add a font to the doc
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica);

  const indexPage = document.getPages()[1];

  const pageHeight = indexPage.getHeight();


  indexPage.drawText(`Indice`, {
    x: SANGRIA,
    y: (pageHeight - FROM_TOP),
    size: 14,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  });

  indice.forEach((element, i) => {
    // El primer elemento lo evitamos del indice porque es la caratula
    if ( i > 0 ){
      //const pageNumber = `${element.page + 1}`.padStart(2, '0')
      indexPage.drawText(` ${element.pageNumber + 1} - ${element.name}`, {
        x: SANGRIA,
        y: (pageHeight - FROM_TOP) - 50 - i * 13,
        size: 11,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
    }
  })

  // Write the PDF to a file
  return document;

}

const parseFilename = (filename) => {
  const extension = path.extname(filename);
  const name = filename.replace(extension, '');
  return [name, extension];
}

const addJpg = async (document, path, name) => {
  const page = document.addPage(PageSizes.A4);

  indice.push({name: name, pageNumber: actualPageNumber});
  actualPageNumber++;

  const imgFile = fs.readFileSync(path);
  const imgJpg = await document.embedJpg(imgFile);

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  const scale = pageWidth / imgJpg.width 

  const { width, height } = imgJpg.scale(scale);
  page.drawImage(imgJpg, {
    x: 0,
    y: (pageHeight / 2 ) - height / 2 ,
    width: pageWidth,
    height: height
  });
}

const addPdf = async (document, path, name) => {

  const toCopy = await PDFDocument.load(fs.readFileSync(path));

  indice.push({name: name, pageNumber: actualPageNumber});
  const contentPages = await document.copyPages(toCopy, toCopy.getPageIndices());
  for (const page of contentPages) {
    actualPageNumber++;
    document.addPage(page);
  }
}



const generatePages = async (files, withIndex) => {

  const document = await PDFDocument.create();

  for (let index = 0; index < files.length; index++) {
    const path = files[index].path;
    const name = files[index].name;

    const [filename, ext] = parseFilename(path);

    // Si se indico que se generara un indice y ya se creo la portada,
    // se agrega la pagina donde sera generado el indice
    if (index === 1 && withIndex ) {
      document.addPage();
    }


    if (ext === '.jpg') {
      await addJpg(document, path, name);
    } else if (ext === '.pdf') {
      await addPdf(document, path, name);
    }
  
    // Imprime en pantalla cuando se crea cada pagina
  
  }



  return document;
}




const addPageNumbers = async (document) => {

  // Add a font to the doc
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica);

  // Draw a number at the bottom of each page.
  // Note that the bottom of the page is `y = 0`, not the top
  const pages = document.getPages();
  for (const [i, page] of Object.entries(pages)) {
    if (i>0){
      page.drawText(`${+i + 1}`, {
        x: page.getWidth() - 20,
        y: 10,
        size: 11,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
    }

  }

  return document; 
}


exports.createPDF = createPDF;
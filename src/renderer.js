import './styles.css';


const list = document.getElementById('list');

document.getElementById('btn-generar').addEventListener('click', () => {

    const options = {
        index: document.getElementById('indice').checked,
        pageNumbers:  document.getElementById('numeros').checked,
        files: getFilesFromList(list)
    }

    window.api.send('create-pdf', options);
})




const pickerArchivosEntrada = document.getElementById('picker-archivos-entrada');
const btnAgregarArchivos = document.getElementById('btn-agregar-archivos');

btnAgregarArchivos.addEventListener('click', () => {
    pickerArchivosEntrada .click();
})

pickerArchivosEntrada.addEventListener('change', (e) => {
    console.log(pickerArchivosEntrada.files);
    populateList([...pickerArchivosEntrada.files]);
    //PDFObject.embed(pickerArchivosEntrada.files[0].path, "#vista-previa", options);
});


const sortable = Sortable.create(list, {
    sort: true,
    animation: 100,
    onSort: (e) => {
    
        console.log(getFilesFromList(e.to));
    }
});

const btnGenerar = document.getElementById('btn-generar');

const btnQuitar = document.getElementById('btn-quitar');

btnQuitar.addEventListener('click', () => {
    const oldElements = getListElements(list);
    console.log(oldElements[0].querySelector('.file-checkbox').checked)
    list.innerHTML = '';
    oldElements.filter((element) => {
        return !element.querySelector('.file-checkbox').checked
    }).forEach(element => list.appendChild(element))
})


const populateList = (files) => {
    const list = document.getElementById('list');
    files.map(createListItem).forEach(element => {
        list.appendChild(element)
    });
}

const createListItem = (file) => {
    const item = document.createElement('li');
    item.className = 'file-item';
    item.innerHTML = `

        <input class="file-checkbox" type="checkbox"></input>
        <div>
            <p class="file-title" contentEditable="true">${file.name}</p>
            <p class="file-name">${file.path}</p>
        </div>

    `;
    return item;
}

const getFilesFromList = (list) => {
    return getListElements(list).map(element => ({
        name: element.querySelector('.file-title').innerText,
        path: element.querySelector('.file-name').innerText
    }))
    
}

const getListElements = (list) => {
    const elements = list.getElementsByTagName('li');
    return [...elements]
}


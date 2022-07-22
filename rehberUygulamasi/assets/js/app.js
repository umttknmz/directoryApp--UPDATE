const form = document.getElementById('form-rehber');
form.addEventListener('submit', save)
const inputName = document.getElementById('ad');
const inputSurname = document.getElementById('soyad');
const inputMail = document.getElementById('mail');
const tbody = document.querySelector('.kisi-listesi');
const savedBtn = document.querySelector('#kaydet');
const hr = document.querySelector('.bilgii');
const tTemizle = document.getElementById('tTemizle');
const container = document.querySelector('.container');
tTemizle.addEventListener('click', clear);

let persons = []; //Kişilerin değerlerini saklamak için bir dizi oluşturuyorum. Dizide id kısmını ekledim çünkü id kısmına göre gümcelleme silme işlemlerini yapacagım arka planda dizi içerisinde id olacak ama tablo kısmnda gözükmeyecektir.

let editId;
//let isEdit = false;

if (localStorage.getItem('persons') !== null) {
    persons = JSON.parse(localStorage.getItem('persons'));
}

addTable();
modalAdd();

function save(e) {
    e.preventDefault();
    const messageDiv = document.createElement('div'); // Uyarı mesajları vememiz için oluşturulan div
    if (inputName.value != "" && inputSurname.value != "" && inputMail.value != "") { // input içerinde değer yok ise boş geçilmemesi için uyarı verdiriyoruz.
        //Ekleme yapılacak yer
        persons.push({ 'id': persons.length + 1, 'name': inputName.value, 'surname': inputSurname.value, 'mail': inputMail.value }); //Diziye key ve value leri ile birlikte tutması için persons dizisine aktarıyorum.
        messageDiv.textContent = 'Kayıt Başarılıdır.';//Mesaj divinin içerisinde yazacagı text'i yazdırıyorum.
        messageDiv.className = 'alert';//hangi classı alagını ekliyorum 
        messageDiv.classList.add('alert-success');// birden fazla class oldugu için class list ile bir class daha ekliyorum.
        document.querySelector(".container").insertBefore(messageDiv, form);
        deleteDiv(); // bu fonksiyonu çagırıyorum çünkü belli bir süre sonra çıkan divin kaybolmasını istiyorum.
        inputValueDelete(); // input textlerin içerisinde yazan değeri boşaltması için çagırdıgım fonksiyon
        document.querySelector('.kisi-listesi').innerHTML = ""; // tablo yapısını bozmaması ve üzerine tekrar yazmaması için tbody deki verileri sıfırlayıp addtable fonksiyonu ile yenileniş şekilde çagırıyorum.
        addTable(); // tablo ekledigimiz fonksiyonu tekrar çagırıyorum.
        localStrogeSave();
    } else {
        //Boş alanın olması durumunda çalışacak alandır.
        messageDiv.textContent = "Boş alan bırakılamaz!";
        messageDiv.className = "alert";
        messageDiv.classList.add('alert-error');
        document.querySelector(".container").insertBefore(messageDiv, form);
        deleteDiv();
    }
}

function addTable() {
    for (let person of persons) {
        let trTag = `
            <tr class='eklenenTr'>
                <th>${person.name}</th> 
                <th>${person.surname}</th>
                <th>${person.mail}</th>
                <th>
                    <button onclick='btnEdit(${person.id},"${person.name}","${person.surname}","${person.mail}")' class="btn btn--edit open-modal"><i class="far fa-edit"></i></button>
                    <button onclick='btnTrash(${person.id})' class="btn btn--trash"><i class="far fa-trash-alt"></i></button>
                </th>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", trTag); //beforeend => hep aşagıdaki durumu baz alarak bir sonraki şeklinde devam eder.

    }
}

function deleteDiv() {
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 1000);

}

function inputValueDelete() {
    form.reset(); //form içerisin de input değerlerini boşaltmamıza yarıyor.
}

function btnTrash(id) {
    let deleteId;
    for (let person in persons) {
        if (persons[person].id == id) {
            deleteId = person;
        }
    }
    persons.splice(deleteId, 1);
    document.querySelector('.kisi-listesi').innerHTML = "";
    addTable();
    localStrogeSave();
}

function btnEdit(id, name, surname, mail) {
    const modalName = document.querySelector('#modalAd');
    const modalSurname = document.querySelector('#modalSoyad');
    const modalMail = document.querySelector('#modalMail');

    document.querySelector('.modal').classList.toggle('modal-open');

    editId = id; // id durumuna göre güncelleyecegimiz için parametreden gelen id yi kendi tanımladıgım editId değişkenine atıyorum.
    //isEdit = true; // isEdit adında bir değişken tanımladım durumunu false olarak verdim ancak güncelleme durumunda true dönderdim bunun sebebi tukarıda ekle fonsiyonunda karışıklıga sebep olmasın diye bunu if else ile ayırdım.
    modalName.value = name; // name parametresinden gelen değeri inputText deperine atıyorum. 
    modalSurname.value = surname; // surname parametresinden gelen değeri inputText deperine atıyorum. 
    modalMail.value = mail; // mail parametresinden gelen değeri inputText deperine atıyorum. 
}

function clear() {
    persons.splice(0, persons.length); // dizi içerisinde ki length durumu 0 dan dizinin uzunlugu kadar seçtirip tüm hepsini silme işlemi yaptırıyorum.
    localStrogeSave();
    document.querySelector('.kisi-listesi').innerHTML = "";
    addTable();
}

function localStrogeSave() {
    localStorage.setItem('persons', JSON.stringify(persons));
}

function modalAdd() {
    let modal = document.createElement('div');
    modal.classList.add('modalSkeleton');
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-inner">
                <div class="modal-content">
                    <div class="modal-close-icon">
                      <a href="javascript:void(0)" class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></a>
                    </div>
                    <div class="modal-content-inner">
                        <div>
                            <h3>Yeniden Yapılandır</h3>
                        </div>
                        <div>
                            <label for="modalAd">Adınız</label>
                            <input type="text" id="modalAd" class="inputText"  value="">
                        </div>
                        <div>
                            <label for="modalSoyad">Soyadınız</label>
                            <input type="text" id="modalSoyad" class="inputText" value="">
                        </div>
                        <div>
                            <label for="modalMail">E-Mail Adresiniz</label>
                            <input type="text" id="modalMail" class="inputText" value="">
                        </div>
                    </div>
                    <hr class="modal-buttons-seperator">
                    <div class="modal-buttons">
                        <button class="button close-modal">Çıkış</button>
                        <button class="button button-primary close-modal" onclick="btnUpdate()">Değişiklikleri Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(modal);
}

// function modalControl() {
//     if (persons.length != 0) {
//         modalAdd();
//     }
// }

function btnUpdate() {
    const modalName = document.querySelector('#modalAd');
    const modalSurname = document.querySelector('#modalSoyad');
    const modalMail = document.querySelector('#modalMail');

    for (let person of persons) {
        if (person.id == editId) {
            person.name = modalName.value;
            person.surname = modalSurname.value;
            person.mail = modalMail.value;
            document.querySelector('.kisi-listesi').innerHTML = "";
            addTable();
        }
        isEdit = false;
    }
    localStrogeSave();
}
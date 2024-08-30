// CONTAINER
const container = document.querySelector('main .container')
const searchBar = document.querySelector('#search-bar')
const btn = document.querySelectorAll('.btn')


//sidebar 
const menuItems = document.querySelectorAll('.menu-item');

// Messages

const messagesNotification = document.querySelector('#messages-notification');
const messages = document.querySelector('.messages')
const message = messages.querySelectorAll('.message')
const messageSearch = document.querySelector('#message-search')

// theme
  
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme')
const fontSizes = document.querySelectorAll('.choose-size span')
var root = document.querySelector(':root')
const backgroundColors = document.querySelectorAll('.choose-bg > div')
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');

// --------------- sidebar ---------------------- //

//remove active class from all menu items

const changeActiveItem = () =>{
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item =>{
    item.addEventListener('click', () =>{
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications'){
            document.querySelector('.notification-popup').style.display = 'none';
        }
        else{
            document.querySelector('.notification-popup').style.display = 'block';
            document.querySelector('.notification-count').style.display = 'none';
        }
    })
})
 
// ------------------- Messages -----------------

// searches chats
searchMessage = () =>{
    const val = messageSearch.value.toLowerCase();
    message.forEach(chat =>{
        let name = chat.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1){
            chat.style.display = 'flex';
        }
        else{
            chat.style.display = 'none';
        }
    })
};

// search chat
messageSearch.addEventListener('keyup' , searchMessage);


// on click box shadow
messagesNotification.addEventListener('click' , () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messagesNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    } , 3000);
    
});


// ----------------------------------------THEME CUSTOMIZATION----------------------------------

const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

const closeThemeModal = (e) =>{
    if(e.target.classList.contains('customize-theme')){
        themeModal.style.display = 'none';
    }
}

themeModal.addEventListener('click' , closeThemeModal);
theme.addEventListener('click' , openThemeModal);

// <------------------------------------- fonts-------------------->

const maxFontSizeProps = () => {
    container.style.width = "95%";
    container.gridTemplateColumns = "20vw auto 25vw";
    container.columnGap = "1rem";
    //searchBar.style.setProperty("----search-padding", "0.3rem");
}

// remove active class from spans or font size selectors
const removeSizeSelector =() =>{
    fontSizes.forEach(size => {
        size.classList.remove('active');
    })
}

fontSizes.forEach(size =>{
    
    size.addEventListener('click' , () =>{
        removeSizeSelector();
        let fontSize;
        size.classList.add('active');   
        
        if(size.classList.contains('font-size-1')){
            fontSize = '10px'
            root.style.setProperty('----sticky-top-left' , '5.4rem')
            root.style.setProperty('----sticky-top-right' , '5.4rem')
        }
        else if(size.classList.contains('font-size-2')){
            fontSize = '13px'
            root.style.setProperty('----sticky-top-left' , '5.4rem')
            root.style.setProperty('----sticky-top-right' , '-7rem')
        }
        else if(size.classList.contains('font-size-3')){
            fontSize = '16px'
            root.style.setProperty('----sticky-top-left' , '-2rem')
            root.style.setProperty('----sticky-top-right' , '-17rem')
        }
        else if(size.classList.contains('font-size-4')){
            fontSize = '19px'
            root.style.setProperty('----sticky-top-left' , '-5rem')
            root.style.setProperty('----sticky-top-right' , '-25rem')
        }
        else if(size.classList.contains('font-size-5')){
            fontSize = '22px'
            root.style.setProperty('----sticky-top-left' , '-12rem')
            root.style.setProperty('----sticky-top-right' , '-35rem')
            maxFontSizeProps();
        }

         // change font size of rooot html element

    document.querySelector('html').style.fontSize = fontSize;
    
    })
   
})

// <------------------------- COLORS ------------------------>

// remove active class from colors
const changeActiveColorClass = ()=>{
    colorPalette.forEach(colorPicker =>{
        colorPicker.classList.remove('active');
    })
}
 
// change primary colors
colorPalette.forEach(color =>{
    color.addEventListener('click' , ()=>{
        let primary;
        changeActiveColorClass();

        if(color.classList.contains('color-1')){
            primaryHue = 252;
        }else if(color.classList.contains('color-2')){
            primaryHue = 52;
        }else if(color.classList.contains('color-3')){
            primaryHue = 352;
        }else if(color.classList.contains('color-4')){
            primaryHue = 152;
        }else if(color.classList.contains('color-5')){
            primaryHue = 202;
        }
        color.classList.add('active');

        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})

// <----------------------- background---------------------------->

// theme background values

let lightColorLightness;
let whiteColorLightness;
let darkColorLightness; 

// change background color
const changeBG = () =>{
    root.style.setProperty('--light-color-lightness' , lightColorLightness );
    root.style.setProperty('--white-color-lightness' , whiteColorLightness);
    root.style.setProperty('--dark-color-lightness' , darkColorLightness );

}

// change background 
Bg1.addEventListener('click', ()=>{
    //add active class
    Bg1.classList.add('active');
    //remove active class
    Bg2.classList.remove('active')
    Bg3.classList.remove('active')
    //remove customize changes from local storage
    window.location.reload();
})

Bg2.addEventListener('click', ()=>{
    lightColorLightness = '15%';
    whiteColorLightness = '20%';
    darkColorLightness = '95%'; 

    // add active class
    Bg2.classList.add('active');
    //remove active class from the others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
})

Bg3.addEventListener('click', ()=>{
    // lightColorLightness = '15%';
    // whiteColorLightness = '20%';
    // darkColorLightness = '0%'; 

    lightColorLightness = '0%';
    whiteColorLightness = '10%';
    darkColorLightness = '95%';

    // add active class
    Bg3.classList.add('active');
    //remove active class from the others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
})
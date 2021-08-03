import _ from "lodash";
import $ from 'jquery';
import moment from "moment";
import Swiper from 'swiper';
window.Swiper = Swiper;

window.$ = window.jquery = window.jQuery = $;
window.moment = moment;

//공통
import common from "./divide/common";
import layout from "./divide/layout";
import main from "./divide/main";

//페이지별
import findAddress from "./divide/findAddress";
import weather from "./divide/weather";
import olenzFreegift from "./divide/olenzFreegift";
import brandIndexer from "./divide/brandIndexer";
import filter from "./divide/filter";
import fileReader from "./divide/fileReader";
import ktGigaSoundChart from "./divide/ktGigaSoundChart";
import contact from "./divide/contact";
import searchKeyword from "./divide/searchKeyword";

 /* resize */
 const htmlDoc = document.documentElement;
 let enSizing = false;
 
 function setFontSize() {
     if (window.innerWidth > window.innerHeight || window.innerWidth > 750) {
        htmlDoc.style.fontSize = "";
        return ;
     }
     htmlDoc.style.fontSize = parseInt(htmlDoc.offsetWidth / 360 * 100) + '%';
 }
 
 $(window).on("load resize", function () {
     if (!enSizing) {
         window.requestAnimationFrame(function() {
             setFontSize();
             enSizing = false;
         });
     }
     enSizing = true;
})
 
 window.dispatchEvent(new Event('resize'));

import emailjs from "emailjs-com";
window.emailjs = emailjs;

const appMethods = {
    common,
    layout,
    main,
    findAddress,
    weather,
    olenzFreegift,
    brandIndexer,
    filter,
    fileReader,
    ktGigaSoundChart,
    contact,
    searchKeyword
}

//페이지별 공통
const pageCommonMethod = {
    // "search": search_common,
}

const appInit = () => {
    const appName = $("body").attr("id");

    if (appName) {
        [common, layout, appMethods[appName]].forEach(method => {
            if (method) method();
        });

        for (let [page, method] of Object.entries(pageCommonMethod)) {
            if (appName.indexOf(page)!= -1) {
                if(method) method();
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    appInit();
})
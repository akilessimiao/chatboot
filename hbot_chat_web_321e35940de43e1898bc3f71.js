"use strict";

var hbotSettings = hbotChangeSettingsByOrigin({"ScriptChatWeb":null,"BarColor":"#1f7ecc","TextColor":"#ffffff","MinStayColor":null,"Position":"right","Title":"BETA GEMINI TESTE","Avatar":"https://hsystem-hbot.s3.amazonaws.com/public/AVATAR-BOT.png","AssistentLink":"https://hbot.hsystem.com.br/assistent-hbot/6665eaf2a30f9800018501d9","ScriptLink":null,"ExternalLink":"https://hbot.com.br/webchat/e3783","Token":"e3783","ExternalLinkTitle":"BETA GEMINI TESTE","ExternalLinkDescription":"Atendimento online 24 horas, como posso ajudar?","IsActiveChatWeb":true,"NotificationTitle":"Melhor tarifa aqui!","NotificationSubtitle":"Atendimento 24h","DesktopPositionHeightInPixels":12,"MobilePositionHeightInPixels":12,"TitleTextColor":"#fff","SubtitleTextColor":"#fff","BackgroundTitleTextColor":"#454545","BackgroundSubtitleTextColor":"#12648f","CustomStyles":"","CustomScripts":"","IntegratorCompanyId":"321e35940de43e1898bc3f71","IsActiveBookingEngine":true,"NotificationTitleBookingEngine":"Alguma dúvida?","NotificationSubtitleBookingEngine":"Clique aqui!","DesktopPositionHeightInPixelsBookingEngine":90,"MobilePositionHeightInPixelsBookingEngine":70,"TitleTextColorBookingEngine":"#fff","SubtitleTextColorBookingEngine":"#fff","BackgroundTitleTextColorBookingEngine":"#454545","BackgroundSubtitleTextColorBookingEngine":"#12648f","CustomStylesBookingEngine":"","CustomScriptsBookingEngine":""})
var hbotCompanyId = hbotSettings.AssistentLink.split('https://s3-sa-east-1.amazonaws.com/');

if (hbotCompanyId && hbotCompanyId.length > 0)
    hbotCompanyId = hbotCompanyId[hbotCompanyId.length - 1];

let hbotHead = document.getElementsByTagName('HEAD')[0];

let hbotStyleDefault = document.createElement("link");
let hbotCssFileName = hbotSettings.ExternalLink.includes("staging") ? "hbot-create-staging.css" : "hbot-create.css";

hbotStyleDefault.href = `https://hsystem-hbot.s3.amazonaws.com/public/HBOT_CHAT_CLIENT/releases/v2/${hbotCssFileName}`;
hbotStyleDefault.rel = "stylesheet";
hbotStyleDefault.type = "text/css";

hbotHead.appendChild(hbotStyleDefault);

var hbotInsertStruct = function (struct) {
    let hbotDiv = document.createElement("div");
    hbotDiv.innerHTML = struct;
    document.body.appendChild(hbotDiv);
}

var hbotToggleChat = function () {
    var chat = document.getElementById('chat');

    if (!chat || chat.tagName != 'IFRAME') {
        var chat = document.createElement("iframe");
        chat.id = 'hbot-chat'
        chat.style = `${hbotSettings.Position}: 10px; visibility: hidden;`;
        chat.src = hbotSettings.AssistentLink
        document.getElementById('hbot-chat-content').appendChild(chat);
    
        setTimeout(function() {                    
            document.getElementById("hbot-chat").style.visibility = 'visible';
        }, 1000);
    }

    let hbotChatIframe = document.getElementById("hbot-chat-content")
    let hbotTextContent = document.getElementById("hbot-icon-text");

    if (hbotChatIframe.style.display === "block")
        return hbotChatIframe.style.display = "none";

    hbotTextContent.style.display = "block";
    hbotChatIframe.style.display = "block";

    if (hbotCompanyId)
        hbotSetUsabilityMetric(hbotCompanyId, 1);
}

function hbotToggleTextContent() {
    let hbotTextContent = document.getElementById("hbot-icon-text");

    if (hbotTextContent.style.display === "block")
        return hbotTextContent.style.display = "none";

    hbotTextContent.style.display = "block";
}

var hbotSetInnerHtmlWithScript = function (elm, html) {
    elm.innerHTML = html;
    let hbotScripts = elm.getElementsByTagName("script");

    let hbotScriptsClone = [];
    for (let i = 0; i < hbotScripts.length; i++) {
        hbotScriptsClone.push(hbotScripts[i]);
    }
    for (let i = 0; i < hbotScriptsClone.length; i++) {
        let hbotCurrentScript = hbotScriptsClone[i];
        let s = document.createElement("script");
        for (let j = 0; j < hbotCurrentScript.attributes.length; j++) {
            let a = hbotCurrentScript.attributes[j];
            s.setAttribute(a.name, a.value);
        }
        s.appendChild(document.createTextNode(hbotCurrentScript.innerHTML));
        hbotCurrentScript.parentNode.replaceChild(s, hbotCurrentScript);
    }
}

function hbotSetUsabilityMetric(id, type) {
    fetch('https://hbotapi.hsystem.com.br/api/usabilitymetrics/create',
        {
            method: 'POST', body: JSON.stringify({ companyId: id, metricType: type, channelType: 0 }),
            headers: { 'Content-type': 'application/json' }
        }).then(function (response) {
            if (response.ok)
                return response.json();

            return Promise.reject(response);
        }).catch(function (error) {
            console.warn('Algo ocorreu de forma inesperada.', error);
        });
}

function hbotIsBookingEngine() {
    let hbotOrigin = window.location.hostname;
    let hbotBookingEngineOrigins = ["hbook.hsystem.com.br", "book.omnibees.com"];

    return hbotBookingEngineOrigins.some(bookingEngine => bookingEngine.includes(hbotOrigin)) && hbotOrigin;
}

function hbotChangeSettingsByOrigin(settings) {
    if (!hbotIsBookingEngine())
        return settings;

    settings.NotificationTitle = settings.NotificationTitleBookingEngine;
    settings.NotificationSubtitle = settings.NotificationSubtitleBookingEngine;

    settings.TitleTextColor = settings.TitleTextColorBookingEngine;
    settings.BackgroundTitleTextColor = settings.BackgroundTitleTextColorBookingEngine;
    settings.SubtitleTextColor = settings.SubtitleTextColorBookingEngine;
    settings.BackgroundSubtitleTextColor = settings.BackgroundSubtitleTextColorBookingEngine;

    settings.CustomStyles = settings.CustomStylesBookingEngine;
    settings.CustomScripts = settings.CustomScriptsBookingEngine;

    settings.MobilePositionHeightInPixels = settings.MobilePositionHeightInPixelsBookingEngine;
    settings.DesktopPositionHeightInPixels = settings.DesktopPositionHeightInPixelsBookingEngine;

    return settings;
}

function hbotAllowedForShow() {
    try {
        hbotSettings.IsActive = hbotSettings.IsActiveChatWeb;

        if (hbotIsBookingEngine())
            hbotSettings.IsActive = hbotSettings.IsActiveBookingEngine;

        if (hbotFoundUnsafeScript())
            console.warn("ATENÇÃO: hbot tentou inicializar script pelo HBook porém já existe uma versão antiga, favor solicitar a remoção do script antigo e deixar somente do HBook.");

        return hbotSettings.IsActive && !hbotFoundUnsafeScript();
    } catch (exception) {
        console.error("HBOT tentou validar se permite ou não inserir script do chat e ocorreu uma exceção.");
        console.error(exception)
    }
}

function hbotFoundUnsafeScript() {
    let hbotPathScript = `hbot_chat_web_${hbotCompanyId}.js`;

    return document.head.outerHTML.includes(hbotPathScript) || document.body.outerHTML.includes(hbotPathScript);
}

function isMobile() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
}

function getFontFamily(type) {
    var fontFamily = "";
    var element = "";
    if(type == 'Title')
        element = document.querySelector('h1');
    else
        element = document.querySelector('body');
    
    if(element)
        fontFamily = getComputedStyle(element).fontFamily;        
    else
        fontFamily = 'system-ui';
       
    return fontFamily;
}


var startHBotScript = function () {
    if (!hbotAllowedForShow())
        return;

    hbotSetUsabilityMetric(hbotCompanyId, 0);

    let hbotStruct = isMobile() || window.screen.width < 480 ? 
    `
        <div id="HBotStruct">
            <div id="hbot-icon-content" style="${hbotSettings.Position}: 24px;">
                <div id="hbot-icon-text" class="${hbotSettings.Position == 'right' ? 'hbot-icon-text-right' : 'hbot-icon-text-left'}" style="top: -45px; margin-right: -15px;">
                    <div id="hbot-icon-text-title" onClick="hbotToggleTextContent()" style="height: 35px">${hbotSettings.NotificationTitle}</div>
                    <div id="hbot-icon-text-sub-title" onClick="hbotToggleChat()">${hbotSettings.NotificationSubtitle}</div>
                    <div id="hbot-icon-text-close" class="${hbotSettings.Position == 'right' ? 'hbot-icon-text-close-right' : 'hbot-icon-text-close-left'}" onClick="hbotToggleTextContent()">
                        <span id="hbot-icon-text-close-btn">x</span>
                    </div>
                </div>
                
                <img id="hbot-icon-bot" src="${hbotSettings.Avatar}" onClick="hbotToggleChat()" style="${hbotSettings.Position}: 0px; max-width: 46px; max-height:46px; min-width: 46px; min-height:46px; object-fit:cover;" alt="avatar chatbot">
            </div>

            <div id="hbot-chat-content" style="display: none; ${hbotSettings.Position}: 10px;">
                <a id="hbot-chat-min" onClick="hbotToggleChat()" style="width: 25px">
                    <span id="hbot-chat-min-minus"></span>
                </a>
                <img id="hbot-chat-loader" src="${hbotSettings.Avatar}">
                <p id="chat-loader-text">Carregando...</p>
            </div>
        </div>

        <style>
            #hbot-icon-text-title {
                color: ${hbotSettings.TitleTextColor};
                background: ${hbotSettings.BackgroundTitleTextColor};
                font-family: ${getFontFamily('Title')} !important;
            }

            #hbot-icon-text-sub-title {
                color: ${hbotSettings.SubtitleTextColor};
                background: ${hbotSettings.BackgroundSubtitleTextColor};
                font-family: ${getFontFamily('Subtitle')} !important;
            }
            
            #hbot-icon-text-close {
                background-color: ${hbotSettings.BackgroundSubtitleTextColor};
                color: ${hbotSettings.SubtitleTextColor};
            }

            .hbot-icon-text-right:after {
                border-top-color: ${hbotSettings.BackgroundSubtitleTextColor};
            }

            .hbot-icon-text-left:after {
                border-top-color: ${hbotSettings.BackgroundSubtitleTextColor};
            }

            #hbot-icon-content {
                bottom: ${hbotSettings.DesktopPositionHeightInPixels}px;
            }

            @media (max-width: 767px) {
                #hbot-icon-content {
                    bottom: ${hbotSettings.MobilePositionHeightInPixels}px;
                }
            }

            #chat-loader-text {
                text-align: center;
            }

            ${hbotSettings.CustomStyles}
        </style>
    `
    :
    `
        <div id="HBotStruct">
            <div id="hbot-icon-content" style="${hbotSettings.Position}: 24px;">
                <div id="hbot-icon-text" class="${hbotSettings.Position == 'right' ? 'hbot-icon-text-right' : 'hbot-icon-text-left'}">
                    <div id="hbot-icon-text-title" onClick="hbotToggleTextContent()">${hbotSettings.NotificationTitle}</div>
                    <div id="hbot-icon-text-sub-title" onClick="hbotToggleChat()">${hbotSettings.NotificationSubtitle}</div>
                    <div id="hbot-icon-text-close" class="${hbotSettings.Position == 'right' ? 'hbot-icon-text-close-right' : 'hbot-icon-text-close-left'}" onClick="hbotToggleTextContent()">
                        <span id="hbot-icon-text-close-btn">x</span>
                    </div>
                </div>
                
                <img id="hbot-icon-bot" src="${hbotSettings.Avatar}" onClick="hbotToggleChat()" style="${hbotSettings.Position}: 0px; border: solid 2px ${hbotSettings.BarColor}; object-fit:cover;" alt="avatar chatbot">
            </div>

            <div id="hbot-chat-content" style="display: none; ${hbotSettings.Position}: 10px;">
                <a id="hbot-chat-min" onClick="hbotToggleChat()">
                    <span id="hbot-chat-min-minus"></span>
                </a>
                <img id="hbot-chat-loader" src="${hbotSettings.Avatar}">
                <p id="chat-loader-text">Carregando...</p>
            </div>
        </div>

        <style>
            #hbot-icon-text-title {
                color: ${hbotSettings.TitleTextColor};
                background: ${hbotSettings.BackgroundTitleTextColor};
                font-family: ${getFontFamily('Title')} !important;
            }

            #hbot-icon-text-sub-title {
                color: ${hbotSettings.SubtitleTextColor};
                background: ${hbotSettings.BackgroundSubtitleTextColor};
                font-family: ${getFontFamily('Subtitle')} !important;
            }
            
            #hbot-icon-text-close {
                background-color: ${hbotSettings.BackgroundSubtitleTextColor};
                color: ${hbotSettings.SubtitleTextColor};
            }

            .hbot-icon-text-right:after {
                border-top-color: ${hbotSettings.BackgroundSubtitleTextColor};
            }

            .hbot-icon-text-left:after {
                border-top-color: ${hbotSettings.BackgroundSubtitleTextColor};
            }

            #hbot-icon-content {
                bottom: ${hbotSettings.DesktopPositionHeightInPixels}px;
            }

            @media (max-width: 767px) {
                #hbot-icon-content {
                    bottom: ${hbotSettings.MobilePositionHeightInPixels}px;
                }
            }

            #chat-loader-text {
                text-align: center;
            }

            ${hbotSettings.CustomStyles}
        </style>
    `;

    hbotInsertStruct(hbotStruct);

    let hbotCustomScript = document.createElement("div");
    hbotSetInnerHtmlWithScript(hbotCustomScript, `<script>${hbotSettings.CustomScripts}</script>`);
    document.body.appendChild(hbotCustomScript);
};


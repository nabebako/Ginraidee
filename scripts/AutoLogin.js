function AUTO_LOGIN_INTI()
{
    const XHR = new XMLHttpRequest();
    XHR.onload = () =>
    {

    }
    XHR.open('POST', '/autologin');
    XHR.send();
}
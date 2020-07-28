module.exports = function (source, map) {
    console.log(source);
    console.log("my loader is running!!!!!!!!!!!!!!!!!!!\n" , this.resourcePath);
    return "";
}
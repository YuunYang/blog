const fs = require('fs');
const path = require('path');
const fileName = path.join(__dirname, './words.json');
const textName = path.join(__dirname, './words.txt');
const file = require(fileName);

fs.watchFile(textName, (curr, prev)=>{
    const txtArray = fs.readFileSync(textName).toString().split('\n');
    for(let i = file.words.length; i < txtArray.length; i++){
        const t = txtArray[i].split('/');
        file.words.push({
            en: t[0],
            cn: t[1]
        })
    }
    txtArray.forEach(txt => {
    });
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('writing to ' + fileName);
    });
    const args = ["add", "assets"]
    const opts = { stdio: 'inherit', cwd: path.join(__dirname, '../'), shell: true }
    require('child_process').spawn('git', args, opts)
})
process.on('SIGINT', () => {
    const args = ["commit", "-m", "'add words'"]
    const opts = { stdio: 'inherit', cwd: path.join(__dirname, '../'), shell: true }
    require('child_process').spawn('git', args, opts)
    process.exit()
});
const app = window.require('electron').remote
const fs = app.require('fs')
const saveEndOfFile = (data,callback) => {
  try {
    let {
      request: { call_id: call_id, to: { uri: { user: toUri } }, from: { uri: { user: fromUri } } },
      session: { direction: direction, id: id, start_time:start_time }
    } = data
    const saveData = {
      call_id: call_id,
      to: toUri,
      from: fromUri,
      direction: direction,
      id: id,
      start_time:start_time
    }
    get().then(res => {
      let calls = JSON.parse(res)
      calls = [saveData, ...calls]
      fs.writeFileSync('./records.json', JSON.stringify(calls))
      callback();
    }).catch(err => {
      console.log(err, 'bir hata oluştu')
    })
  } catch (e) {
    alert('Arama kaydı kaydedilemedi')
  }


}

const updateCall = (id, data,callback) => {
  let { start_time: start_time, end_time: end_time } = data
  const diff = end_time.getTime() - start_time.getTime()

  get().then(res => {
    let calls = JSON.parse(res)
    calls.map(call => {
      if (call.id == id) {
        call.start_time = start_time
        call.end_time = end_time
        call.diff = (diff/1000).toFixed(1);
      }
      return call
    })
    fs.writeFileSync('./records.json', JSON.stringify(calls))
    callback();

  })
}

const get = async () => {
  return await fs.readFileSync('./records.json', 'utf8', async (err, data) => {
    return await (JSON.parse(data))
  })
}
export { saveEndOfFile as save, get, updateCall }
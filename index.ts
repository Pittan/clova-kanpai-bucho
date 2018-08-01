import Client from '@line/clova-cek-sdk-nodejs/dist/types/client'
import { Context } from '@line/clova-cek-sdk-nodejs/dist/types/context'

const clova = require('@line/clova-cek-sdk-nodejs')
const express = require('express')
const bodyParser = require('body-parser')

const onLaunchRequestHandler = (responseHelper: Context) => {
  responseHelper.setSimpleSpeech({
    lang: 'ja',
    type: 'PlainText',
    value: '今日も一日お疲れ様です、乾杯の音頭はお任せください！'
  })
}

const onIntentRequestHandler = async (responseHelper: Context) => {
  const intent = responseHelper.getIntentName()
  const slots = responseHelper.getSlots()
  const sessionId = responseHelper.getSessionId()

  switch (intent) {
    case 'Music':
      console.log(slots)
      let url = 'awesome.mp3'

      if (slots.music_name) {
        if (slots.music_name === 'トーフビーツ') {
          url = 'abc.mp3'
        }
        if (slots.music_name === 'SKE') {
          url = 'sound.mp3'
        }
      }
      responseHelper.responseObject.response.directives = [
        {
          'header': {
            'messageId': 'abcdefg',
            'namespace': 'AudioPlayer',
            'name': 'Play'
          },
          'payload': {
            'audioItem': {
              'audioItemId': 'hogehogeeee',
              'title': 'song title',
              'artist': 'artist name',
              'stream': {
                'beginAtInMilliseconds': 0,
                'token': 'sample-token',
                'url': url,
                'urlPlayable': true
              }
            },
            'playBehavior': 'REPLACE_ALL'
          }
        }
      ]
      break
    case 'sample':
      // Build speechObject directly for response
      responseHelper.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'サンプルサンプル'
      })
      break
    case 'Kanpai':
      // Build speechObject directly for response
      responseHelper.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'それでは、乾杯の音頭を取らせていただきますので、ご唱和をお願いします。おふたりの末長いお幸せとご両家ならびにご臨席の皆様のご健勝とご多幸をお祈りいたしまして、乾杯！'
      })
      break
  }
}

const clovaSkillHandler: Client = clova.Client
    .configureSkill()
    .onLaunchRequest(onLaunchRequestHandler)
    .onIntentRequest(onIntentRequestHandler)
    .handle()

const app = new express()

app.post('/clova', bodyParser.json(), clovaSkillHandler)

app.listen(3000)

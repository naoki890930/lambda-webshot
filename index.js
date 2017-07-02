'use strict'

const fs = require('fs')
const exec = require('child_process').exec
const aws = require('aws-sdk')
aws.config.region = 'ap-northeast-1'

const CAPTURE_FILENAME = 'test.png'
const KEY = 'capture/' + CAPTURE_FILENAME

exports.handler = (event, context, callback) => {
    const url = process.env.CAPTURE_URL
    const path = '/tmp/' + CAPTURE_FILENAME

    fontconfig()
        .then(() => capture(url, path))
        .then(() => save(KEY, path))
        .then(() => callback(null, 'Sucess'))
        .catch(error => callback(error))
}

function fontconfig() {
    return new Promise((resolve, reject) => {
        exec('cp -r fontconfig /tmp; /tmp/fontconfig/usr/bin/fc-cache -fs', error => {
            if (error) { return reject(error) }
            resolve()
        })
    })
}

function capture(url, path) {
    return new Promise((resolve, reject) => {
        exec('LD_LIBRARY_PATH=/tmp/fontconfig/usr/lib/ node webshot.js ' + url + ' ' + path, (error, stdout) => {
            if (error) { return reject(error) }
            console.log(stdout)
            resolve()
        })
    })
}

function save(key, path) {
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({apiVersion: '2006-03-01'})
        const option = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: fs.createReadStream(path),
        }
        s3.upload(option, (error, data) => {
            if (error) { return reject(error) }
            resolve()
        })
    })
}

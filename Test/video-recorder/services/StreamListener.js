var
    chai = require('chai'),
    promise = require('bluebird'),
    execComand = require('child_process'),
    expect = chai.expect,
    assert = chai.assert,
    Event = require('../../../video-recorder/services/EventEmitterSingleton'),
    StreamListener = require('../../../video-recorder/services/StreamListener')();

describe('Stream Listener Service -', function() {
    describe('startListen() method -', function() {
        describe('inputs test -', function() {
            it('should emit error when there is no params', function(done) {
                this.timeout(2000);
                Event.on('unexceptedError', function tempFunc(err) {
                    console.log(err);
                    done();
                    Event.removeListener('unexceptedError', tempFunc);
                });
                StreamListener.StartListen();
            });

            it('should emit error when the params is empty', function(done) {
                this.timeout(2000);
                Event.on('unexceptedError', function tempFunc(err) {
                    console.log(err);
                    Event.removeListener('unexceptedError', tempFunc);
                    done();
                });
                StreamListener.StartListen({});
            });

            it('should emit error when there is no port', function(done) {
                this.timeout(2000);
                Event.on('unexceptedError', function tempFunc(err) {
                    console.log(err);
                    Event.removeListener('unexceptedError', tempFunc);
                    done();
                });
                StreamListener.StartListen({ Ip: '1.1.1.1' });
            });

            it('should work with Port as string', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Ip: '238.1.0.8', Port: '5555' })
                    .then(function(res) {
                        done();
                    })
                    .catch(function(err) {
                        assert.isOk(false, 'Should Work but didnt : ' + err);
                    });
            });

            it('should work with Port as number', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Ip: '238.1.0.8', Port: 5555 })
                    .then(function(res) {
                        done();
                    })
                    .catch(function(err) {
                        assert.isOk(false, 'Should Work but didnt : ' + err);
                    });
            });

            it('should Change ip to localhost when there is no ip', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Port: 5555 }).then(function(res) {
                    res.ip == '0.0.0.0' ? done() : assert.isOk(false, 'Didnt change to localhost');
                });
            });

            it('should Change ip to localhost when the ip param isn\'t string', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Ip: 88645, Port: 5555 }).then(function(res) {
                    res.ip == '0.0.0.0' ? done() : assert.isOk(false, 'Didnt change to localhost');
                });
            });

            it('should Change ip to localhost when the ip is not valid', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Ip: 'dddd', Port: 5555 }).then(function(res) {
                    if (res.ip == '0.0.0.0') {
                        done();
                    } else {
                        assert.isOk(false, 'Didnt Change to localhost');
                    }
                });
            });

            it('should work with localhost IP', function(done) {
                this.timeout(2000);
                StreamListener.StartListen({ Ip: '238.1.0.8', Port: 5555 })
                    .then(function(res) {
                        done();
                    })
                    .catch(function(err) {
                        assert.isOk(false, 'Should Work but didnt : ' + err);
                    });
            });
        });

        describe('behavior test -', function() {
/*            it('should Emit error when two method call on the same address and port', function(done) {
                this.timeout(5000);
                StreamListener.StartListen({ Ip: '238.0.0.1', Port: 1236 })
                    .then(function(res) {
                        StreamListener.StartListen({ Ip: '238.0.0.1', Port: 1236 })
                            .catch(function(err) {
                                console.log(err);
                                done();
                            }).then(function(res) {
                                assert.isOk(false, 'second method Should not work');
                                done();
                            });
                    }).catch(function(err) {
                        assert.isOk(false, 'first method should work but somthing has happend: ' + err);
                        done();
                    });
            });*/

            it('should Emit event "StreamingData" when data is streaming', function(done) {
                var tmpPorc;
                this.timeout(3000);
                Event.on('StreamingData', function tempFunc() {
                    Event.removeListener('StreamingData', tempFunc);
                    done();
                });
                StreamListener.StartListen({ Ip: '0.0.0.0', Port: 5555 })
                    .then(function(res) {
                        console.log('start the tsplay process...');
                        tmpPorc = execComand.exec('tsplay /home/dins/Desktop/projects/replay-infra/Test/src/Sample_Ts_File_For_Testing.ts 0.0.0.0:5555');
                    })
                    .catch(function(err) {
                        assert.isOk(false, 'the method should work but somthing happend : ' + err);
                        done();
                    });

            });
        });
    });
});

import * as THREE from 'three';

export const playActions = function(actions, arrPlayActions, strBehavior = 'play', intRepeat=0, intDelay = 1000){
    //behaviors = 'play', 'loop', 'pingpong', 'random', 'stop', 'pause'
    arrPlayActions.forEach(function(strAction){
      const action = actions[strAction]
      action.clampWhenFinished = true;
      action.timeScale = 1;
      switch(strBehavior){
        case 'reset':
          action.reset();
        case 'pause':
          action.paused = true;
        case 'stop':
          action.stop();
        case 'play':
          action.setLoop(THREE.LoopOnce, intRepeat).reset().play();
        case 'reverse':
          action.timeScale = -1;
          action.setLoop(THREE.LoopOnce, intRepeat).reset().play();
        case 'loop':
          action.setLoop(THREE.LoopRepeat, 1).reset().play();
            if(intRepeat === 0 || intRepeat > 1){
                setTimeout(function(){
                    let intNewRepeat = intRepeat;
                    if(intRepeat > 1) {
                        intNewRepeat = intRepeat-1;
                    }
                    playActions(actions, [strAction], strBehavior, intNewRepeat, intDelay);
                },intDelay);
            }
        break;
        case 'pingpong':
          action.setLoop(THREE.LoopOnce, intRepeat).reset().play();
          if(intRepeat === 0 || intRepeat > 1){
            setTimeout(function(){
                let intNewRepeat = intRepeat;
                if(intRepeat > 1) {
                    intNewRepeat = intRepeat-1;
                }
                playActions(actions, [strAction], 'reverse', intNewRepeat, intDelay);
            },intDelay);
          }
        break;
        case 'random':
            //randomly decide to play this action or not
            if(Math.random() > 0.5) {
                action.setLoop(THREE.LoopOnce, 1).reset().play()
            }
            //delay and try again
            if(intRepeat === 0 || intRepeat > 1){
            setTimeout(function(){
                let intNewRepeat = intRepeat;
                if(intRepeat > 1) {
                    intNewRepeat = intRepeat-1;
                }
                playActions(actions, [strAction], strBehavior, intDelay, intNewRepeat);
            }, intDelay);}
            break;
        default:
          break;
      }
    });
  }  
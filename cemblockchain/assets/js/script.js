$('.burger_menu_icon').on('click', function(){
    $('#burgerMenu').modal('show')
})

$('a').on('click', function(){
    $('#burgerMenu').modal('hide')
})

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 25, 400/300, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

if($('.3d_coin').length != 0){
    var stopAnimate = false
    var timestop
    var noAnimate = false
    var previousCord
    renderer.setSize( 400, 300 );
    document.getElementsByClassName('3d_coin')[0].appendChild( renderer.domElement )
    
    
    
    const aLight = new THREE.AmbientLight(0xffffff, 6.2)
    scene.add(aLight)
    const pLight = new THREE.PointLight(0xffffff, 1.1)
    pLight.position.set(0, -3, 7)
    scene.add(pLight)
    
    let loader = new THREE.GLTFLoader();
    var obj
    loader.load('/assets/3d/coin.gltf', function(gltf){
        obj = gltf
        obj.scene.scale.set(1.3, 1.3, 1.3)
        scene.add(obj.scene)
        renderer.render( scene, camera );
        animate()
        timestop = setTimeout(function(){
            stopAnimate = true
        }, 16000)
    })
    
    function animate() {
        if(!stopAnimate){
            requestAnimationFrame( animate );
        }
        if(obj == null){
            return
        }
        if(noAnimate){
            return
        }
        obj.scene.rotation.y -= 0.01;
        
        renderer.render( scene, camera );
    };
    
    function animateMove(coord) {
        if(typeof obj == 'undefined'){
            return
        }
        obj.scene.rotation.y += coord;
        
        renderer.render( scene, camera );
    };
    
    $('.3d_coin').on('mouseenter', function(e){
        noAnimate = true
        previousCord = e.screenX
    })
    $('.3d_coin').on('mousemove', function(e){
        if(previousCord > e.screenX){
            animateMove(-0.02)
        } else {
            animateMove(0.02)
        }
        previousCord = e.screenX
    })
    $('.3d_coin').on('mouseleave', function(e){
        noAnimate = false
        previousCord = null
        renderer.render( scene, camera );
        if(stopAnimate == true){
            clearTimeout(timestop)
            stopAnimate = false
            requestAnimationFrame( animate );
            timestop = setTimeout(function(){
                stopAnimate = true
            }, 7000)
        }
    })
    
    
    $('.3d_coin').on('touchstart', function(e){
        noAnimate = true
        previousCord = e.changedTouches[0].clientX
    })
    $('.3d_coin').on('touchmove', function(e){
        if(previousCord > e.changedTouches[0].clientX){
            animateMove(-0.02)
        } else {
            animateMove(0.02)
        }
        previousCord = e.changedTouches[0].clientX
    })
    $('.3d_coin').on('touchend', function(e){
        noAnimate = false
        previousCord = null
        renderer.render( scene, camera );
        if(stopAnimate == true){
            clearTimeout(timestop)
            stopAnimate = false
            requestAnimationFrame( animate );
            timestop = setTimeout(function(){
                stopAnimate = true
            }, 7000)
        }
    })
    
    camera.position.z = 6;
    
}

var addCEMChain = async function(){
    if(window.innerWidth < 1199){
        window.location = '/add-network/'
        return
    }
    window.ethereum.request({
		method: 'wallet_addEthereumChain',
		params: [{
		chainId: '0xC1',
		chainName: 'Crypto Emergency',
		nativeCurrency: {
			symbol: 'CEM',
			decimals: 18
		},
		rpcUrls: ['https://cemchain.com/'],
		blockExplorerUrls: ['https://cemscan.com']
		}]
		})
		.catch((error) => {
		console.log(error)
	}) 
}
          
if($('#myChart').length != 0){
    const data = {
        labels: ['IEO', 'Team', 'Reserve', 'Investors', 'Charity', 'Bounty'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [40, 20, 20, 15, 3, 2],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          }
        ]
    }
    var ctx = $('#myChart').get(0).getContext("2d");
    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutout: '88%',
            spacing: 10,
            borderRadius: 100,
            borderWidth: 0,
            responsive: true,
            plugins: {
            legend: {
                display: false,
            },
          }
        },
    })
}

var resultHTML = ''
          
function objectEnumeration(result){
    resultHTML += '<div class="object_item">'
    for(item in result){
        if(typeof result[item] == 'object' && result[item] != null){
            if(result[item].length == 0){
                resultHTML += '<p>"' + item + '": { },</p>'
            } else {
                resultHTML += '<p>"' + item + '": { </p>'
                objectEnumeration(result[item])
            }
        } else if(typeof result[item] == 'array'){
            if(result[item].length == 0){
                resultHTML += '<p>"' + item + '": [ ],</p>'
            } else {
                resultHTML += '<p>"' + item + '": [ </p>'
                arrayEnumeration(result[item])
            }
        } else{
          resultHTML += '<p>"' + item + '": "' + result[item] + '",</p>'
        }
    }
    resultHTML += '<p>},</p></div>'
}

function arrayEnumeration(result){
    resultHTML += '<div class="object_item">'
    for(item in result){
        if(typeof result[item] == 'object' && result[item] != null){
            if(result[item].length == 0){
                resultHTML += '<p>"' + item + '": { },</p>'
            } else {
                resultHTML += '<p>"' + item + '": { </p>'
                objectEnumeration(result[item])
            }
        } else if(typeof result[item] == 'array'){
            if(result[item].length == 0){
                resultHTML += '<p>"' + item + '": [ ],</p>'
            } else {
                resultHTML += '<p>"' + item + '": [ </p>'
                arrayEnumeration(result[item])
            }
        } else{
          resultHTML += '<p>"' + item + '": "' + result[item] + '",</p>'
        }
    }
    resultHTML += '<p>],</p></div>'
}

$('.send').on('click', async function(e){
  let response = await fetch('https://cemchain.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: $(e.target).parent().find('.response').text()
    });
  let result = await response.json();
  resultHTML += '{<div class="object_item">'
  for(item in result){
      if(typeof result[item] == 'object' && result[item] != null){
        if(result[item].length == 0){
            resultHTML += '<p>"' + item + '": { },</p>'
        } else {
            resultHTML += '<p>"' + item + '": { </p>'
            objectEnumeration(result[item])
        }
      } else if(typeof result[item] == 'array'){
        if(result[item].length == 0){
            resultHTML += '<p>"' + item + '": [ ],</p>'
        } else {
            resultHTML += '<p>"' + item + '": [ </p>'
            arrayEnumeration(result[item])
        }
      } else{
        resultHTML += '<p>"' + item + '": "' + result[item] + '",</p>'
      }
  }
  resultHTML += '<p>}</p></div>'
  $(e.target).parent().find('.result').text('')
  $(e.target).parent().find('.result').append(resultHTML)
  $(e.target).parent().find('.result').find('.object_item').each(function(){
      $(this).find('p').each(function(){
          this.innerHTML = '&nbsp;&nbsp;&nbsp;' + this.innerHTML
      })
      $(this).find('p')[$(this).find('p').length - 2].innerHTML = $(this).find('p')[$(this).find('p').length - 2].innerHTML.slice(0, $(this).find('p')[$(this).find('p').length - 2].innerHTML.length - 1)
  })
  $(e.target).parent().find('.result').find('p')[$(e.target).parent().find('.result').find('p').length - 1].innerText = $(e.target).parent().find('.result').find('p')[$(e.target).parent().find('.result').find('p').length - 1].innerText.trim()
  resultHTML = ''
})

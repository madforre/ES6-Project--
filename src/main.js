// 만약 또 다른 뷰가 있다면??
// 내 찜 목록이 아닌 또 다른 목록이 있다?
// 지금은 하나의 클래스에 모든 코드가 다 있다.

// 코드들을 별도의 클래스나 메소드로 분류하고
// 추가를 한다던지 모듈화를 시켜서 유용하게 쓰도록 하자.

class Blog {
    constructor() {
        console.log('Blog is started!');
        this.clicked = false; // 이벤트 한번만 실행
        this.setInitVariables();
        this.registerEvents();
        this.likedSet = new Set();
        // Set? 중복없이 유일한 값을 저장하려고 할 때, 
        // 이미 존재하는지 체크할 떄 유용하다.
    }

    setInitVariables() {
        this.blogList = document.querySelector(".blogList > ul");
    }

    registerEvents() {
        const startBtn = document.querySelector(".start");
        // const dataURL = "json API";
        const dataURL = "/data/data.json";
        // 원래 데이터는 이렇게 두지 말고 따로 import해줘야 한다.
        console.log(this);
        
        startBtn.addEventListener("click", () => {
            if(!this.clicked){
                this.setInitData(dataURL);
                this.clicked = true;
            }
        });

        
        this.blogList.addEventListener("click", ({target}) => {
            const targetClassName  = target.className;
            // console.log(targetClassName);
            // ES6 디스트럭쳐링으로도 받을 수 있다.
            // evt, evt.target이 아닌 방법. 객체의 키를 같은 이름을 가진
            // 변수에 값을 할당.
            
            // ClassName이 like라면 내 찜 목록에 새로운 
            // 블로그 제목을 추가한다.

            // like나 unlike 아니면 종료
            if(targetClassName !== "like" && targetClassName !=="unlike") return; 

            const postTitle = target.previousElementSibling.textContent;

            // 로직?
            // 찜 취소를 클릭한 경우에, 찜하기로 다시 변경하고, 
            // 찜 목록을 제거하고, 찜목록뷰를 랜더링한다.

            if(targetClassName === "unlike") {

                // 텍스트를 자바스크립트 코드안에 넣지 않고
                // 나중에는 오브젝트 형태로 빼서 분리해주자.
                // 자바스크립트 안에 클래스나 이름 들어있으면
                // 안좋은 코드이다.
                target.className = "like";
                target.innerText = "찜하기";

                this.likedSet.delete(postTitle);
            } else {
                // 찜 목록에 추가.
                this.likedSet.add(postTitle); // set통해 중복 되지 않게 찜 선택
                this.likedSet.forEach( (v) => {
                console.log('set data is', v);
                })

                // 찜 된 목록(div)의 클래스를 like에서 unlike로 변경하기.
                target.className = "unlike";
                target.textContent = "찜취소";

            }        

            // 내 찜 목록을 뷰에 추가. (랜더링)
            this.updateLikedList();
        });
    }

    updateLikedList() {
        const ul = document.querySelector(".like-list > ul");
        let likedSum = ""; // 변경이 될 수 있는 변수이므로 let

        // li 태그에 찜 리스트를 넣고 한번의 innerHTML을 사용한다.
        this.likedSet.forEach( (value) => {
            likedSum += `<li> ${value} </li>`;
        })
        ul.innerHTML = likedSum;
    }

    setInitData(dataURL) {
        this.getData(dataURL, this.insertPosts.bind(this));
        // 아래 insertPosts 메소드에서 this가 달라졌기 때문에 바인딩을 해주자.
        // 아마 Ajax 통신 때문인 것 같다.
    }

    getData(dataURL, fn) { // Ajax 호출 및 통신
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", () => {
            const json = JSON.parse(oReq.responseText);
            const list = json.body;
            fn(list);
            // console.log(list);
            // 날아온 배열의 문자열 상태를 JavaScript Object로 바꿔줌(파싱)
        });
        oReq.open('GET', dataURL);
        oReq.send();
    }

    insertPosts(list) {
        // insertPosts 의 this가 달라졌다.
        this.blogList
        list.forEach((v) => {
            this.blogList.innerHTML += `
                <li>
                    <a href=${v.link}>${v.title}</a>
                    <div class="like">찜하기</div>
                </li>`;
        })
    }
}
// index.js에서 인스턴스를 부르는 타이밍에 
// 이러한 일들이 벌어지는 것이다.
export default Blog;
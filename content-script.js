function check_and_add_event_listener() {
    var f1 = document.getElementById('fr-S12397');
    if (f1) {
        // console.log("f1 찾았음");
        var f2 = f1.contentWindow.document.getElementsByName('subBodyFrame')[0];
        if (!f2 || !f2.getAttribute('src').startsWith('/ctt/bb/bulletin?b=')) {
            // console.log('detect cross origin');
            return;
        }
        if (f2) {
            // console.log("f2 찾았음");
            var notice_table = f2.contentWindow.document.getElementById('boardTypeList');
            var check = false;
            if (notice_table) {
                var tmp = notice_table.getAttribute("knc_listener_check");
                if (tmp == "true") {
                    check = true;
                    // console.log("knc_listener_check 찾았음!")
                } else {
                    // console.log("knc_listener_check 찾지못했음!")
                }
            }
            if (notice_table && !check) {
                // console.log("테이블에 대한 이벤트 리스너 생성!");
                notice_table.setAttribute("knc_listener_check", "true")
                notice_table.addEventListener('click', notice_clicked);

                // 표에 있는 데이터 중 읽은 공지를 표시!
                let trs = notice_table.childNodes[3].childNodes;
                // console.log(trs);
                for (let i = 0; i < trs.length; ++i) {
                    let tr = trs[i];
                    if (tr.tagName == "TR" && tr.getAttribute('data-name') == "post_list") {
                        let base_url = tr.getAttribute('data-url');
                        chrome.storage.local.get(base_url, (res) => {
                            if (res.hasOwnProperty(base_url)) tr.style.backgroundColor = 'yellow';
                        });
                    }

                }
            }
        }
    }
}

function notice_clicked(e) {
    // console.log(e);
    for (let i = 0; i < e.path.length; ++i) {
        let ele = e.path[i];
        // console.log(ele.tagName);
        if (ele.tagName == "TR" && ele.getAttribute('data-name') == "post_list") {
            let base_url = ele.getAttribute('data-url');
            if (!base_url) continue;

            // ele.style.backgroundColor = 'yellow';
            chrome.storage.sync.set({
                [base_url]: true
            }, () => {
                console.log(base_url + " set true ");
            });

            // console.log("저장 잘 되었는지 테스트")
            // chrome.storage.local.get(base_url, (res) => {
            //     console.log(res);
            // });
            break;
        }
    }
}

setInterval(check_and_add_event_listener, 500);

// chrome.storage.sync.set({ 'test': 'test' }, function() {
//     console.log('Value is set to ' + 'test');
// });

// chrome.storage.sync.get('test', function(result) {
//     console.log(result);
// });

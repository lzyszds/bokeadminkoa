
const result = () => {
    return fetch("https://chat.openai.com/backend-api/conversation", {
        "headers": {
            "accept": "text/event-stream",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJhMTAyNDMyNzE4OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJwb2lkIjoib3JnLW5ZYlV2YVlUdlhtd3NGNkhyb1JvUjRvQiIsInVzZXJfaWQiOiJ1c2VyLVJZRkFKTDJ4RzI0Qk93ZGlKVnJta1VkWiJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTI4NDY0NTgxNzEzMjA3MDA5ODciLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzEyNTcxNzg5LCJleHAiOjE3MTM0MzU3ODksImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb3JnYW5pemF0aW9uLndyaXRlIG9mZmxpbmVfYWNjZXNzIn0.NkPHxzmerPmoy_99iQB42WA8e78kM-uxOP3h2HOliyig4N9dERCjEVAQMQY9YYVLtto6DOSAG53X4YLfIkTHZGGQAAJgto3p_2R9nVsoEFGMjT1ZaLHZ7383mqlXT48NA-yjG4XdISHHA23rXk7vk52AHVmesOia86MBasINRHHjrUC3P-4UXhlycquBpx_QbzJo_y0LC62PZMKdUjtGi76Zc8iPtKV-wXkG336-639dOf_q56c4V_DDiKtuRD-7_JhK06vMYeFAKsQfW_wLwWInPDItx9MbjPhXRwzpnmkq-0M_v44TDFBpWdhOsnnky7dxJWTJme8lenwGaVGgkA",
            "content-type": "application/json",
            "oai-device-id": "a4372bf1-a582-4a49-9314-ae4fe9189e50",
            "oai-language": "zh-CN",
            "openai-sentinel-chat-requirements-token": "gAAAAABmHr_dD27DUhdTbllWvSJ92wgQ3Hur11xoEFj97I_df0E99ZtjMTKtcCgRFCA56pewDnaUfhhibyut_cM5xLNyZB7JOhQ7mSa2Zw8rxt66lXlChGe-K9zeuguf9PgslBxTK8OLDMbrsqtCQTgGunnWmkMZnEViIlfy8jPH7POcmVUzMBDvs7Hlb9Nf4x8tZnaXnvHuDcOOHXtfvU6i1xtMHrBDTzphfm33fnsiAHURj76vUhbTaxQOSLEElMP4gM2RMYCp4wldvc8LarR4Uxzfnx1fRhGV1LWXb0VwYlhoGNAw1xa8WQR9aSvQWhtF6fGP8HBZUVL7vPP84VeQSsG2r725cg==",
            "sec-ch-ua": "Google Chrome;v=123, Not:A-Brand;v=8, Chromium;v=123",
            "sec-ch-ua-arch": "x86",
            "sec-ch-ua-bitness": "64",
            "sec-ch-ua-full-version": "123.0.6312.123",
            "sec-ch-ua-full-version-list": "Google Chrome;v=123.0.6312.123, Not:A-Brand;v=8.0.0.0, Chromium;v=123.0.6312.123",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "",
            "sec-ch-ua-platform": "Windows",
            "sec-ch-ua-platform-version": "15.0.0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://chat.openai.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{
            "action: "next",
            "messages": [
                {
                    "id": "aaa202c7-5858-4747-aad1-952d75b10fd3",
                    "author": {
                        "role": "user"
                    },
                    "content": {
                        "content_type": "text",
                        "parts": [
                            "你是什么模型"
                        ]
                    },
                    "metadata": {}
                }
            ],
            "parent_message_id": "aaa111b4-edd0-4c34-a7b8-22bee46be718",
            "model": "text-davinci-002-render-sha",
            "timezone_offset_min": -480,
            "suggestions": [
                "随便告诉我一个关于罗马帝国的趣事",
                "你能帮我开发一个自动化工具，根据我设置的参数来安排我的社交媒体帖子吗？首先问我最常使用哪些平台。",
                "写一封电子邮件，向当地的水管工问询回流测试的报价。我需要在接下来的两周内完成。应采用简洁和随意的语气。",
                "为我提供一个 SQL 查询，将名为“status”的列添加到订单表中，默认值设为 PENDING。如果设置了“completed_at”，则将其设置为 COMPLETE。"
            ],
            "history_and_training_disabled": false,
            "conversation_mode": {
                "kind": "primary_assistant"
            },
            "force_paragen": false,
            "force_paragen_model_slug": "",
            "force_nulligen": false,
            "force_rate_limit": false,
            "websocket_request_id": "40e8e128-397f-4263-ad1d-0cfa64deef35"
        }`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

export default result
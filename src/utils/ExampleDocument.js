export const mockDataCommentFromApi = [
  {
    id: "b656cee8-f94c-416f-af9d-ee307659ef83",
    comments: [
      {
        id: "f29b1db7-e18b-4f39-bbe2-8f99717a5597",
        text: "123",
        author: "Shalabh",
        creationTime: "2023-05-24T02:34:45.731Z",
      },
      {
        id: "4a77daa9-9d07-450c-91e7-a44861447619",
        text: "456",
        author: "Shalabh",
        creationTime: "2023-05-24T02:34:48.157Z",
      },
      {
        id: "ebea354a-521e-4cbc-a2d2-2869105353dc",
        text: "789",
        author: "Shalabh",
        creationTime: "2023-05-24T02:34:50.274Z",
      },
    ],
    creationTime: "2023-05-24T02:34:50.274Z",
    status: "open",
  },
  {
    id: "dca58263-0793-46c9-9dfe-3c08f8ac6d70",
    comments: [
      {
        id: "d1b91341-bb16-4dc4-8a20-22627fa61103",
        text: "234",
        author: "Shalabh",
        creationTime: "2023-05-24T02:34:56.701Z",
      },
      {
        id: "5cba5f51-ec97-4b79-a961-36154edf6b78",
        text: "567",
        author: "Shalabh",
        creationTime: "2023-05-24T02:34:59.196Z",
      },
    ],
    creationTime: "2023-05-24T02:34:59.196Z",
    status: "open",
  },
  {
    id: "2543e54f-23e2-4db8-af7b-a38d4a5ea401",
    comments: [
      {
        id: "b40aa44d-7adf-45be-8950-187b043036c9",
        text: "cser",
        author: "Shalabh",
        creationTime: "2023-05-24T02:35:04.648Z",
      },
    ],
    creationTime: "2023-05-24T02:35:01.256Z",
    status: "open",
  },
];

export const Base = [
  {
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];
export const ExampleDocument = [
  {
    type: "paragraph",
    children: [
      {
        text: "Lorem Ipsum",
        bold: true,
      },
      {
        text: " is simply ",
      },
      {
        type: "link",
        url: "123123",
        children: [
          {
            text: "dummy ",
          },
        ],
        articleData: {
          id: 1,
          title: "Mạo từ",
          url: "google.com",
          children: [
            {
              id: 1,
              url: "google.com",
              title: "the",
            },
            {
              id: 2,
              url: "google.com",
              title: "another",
            },
            {
              id: 3,
              url: "google.com",
              title: "another",
            },
          ],
        },
      },
      {
        text: "text of the ",
      },
      {
        text: "printing ",
        "commentThread_b656cee8-f94c-416f-af9d-ee307659ef83": true,
      },
      {
        text: "and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the ",
      },
      {
        text: "1960s ",
        "commentThread_dca58263-0793-46c9-9dfe-3c08f8ac6d70": true,
      },
      {
        text: "with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus ",
      },
      {
        text: "PageMaker ",
        "commentThread_2543e54f-23e2-4db8-af7b-a38d4a5ea401": true,
      },
      {
        text: "including versions of Lorem Ipsum",
      },
    ],
  },
];

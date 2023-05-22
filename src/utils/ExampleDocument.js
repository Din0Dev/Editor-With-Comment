export const mockDataCommentFromApi = [
  {
    id: "4cc2e57d-4ede-4272-b7f4-3c8c96dfbbc0",
    comments: [
      {
        text: "Comment",
        author: "Shalabh",
        creationTime: "2023-05-19T07:52:28.415Z",
      },
    ],
    creationTime: "2023-05-19T07:52:28.415Z",
    status: "open",
  },
  {
    id: "8faaabaf-2a0f-4b10-83a5-f43378850322",
    comments: [
      {
        text: "Fix",
        author: "Shalabh",
        creationTime: "2023-05-19T07:52:33.297Z",
      },
    ],
    creationTime: "2023-05-19T07:52:33.297Z",
    status: "open",
  },
  {
    id: "db982da7-8654-42fc-b840-af23aa6226fc",
    comments: [
      {
        text: "Commented",
        author: "Shalabh",
        creationTime: "2023-05-22T09:53:19.798Z",
      },
    ],
    creationTime: "2023-05-22T09:53:16.298Z",
    status: "open",
  },
  {
    id: "86dd7a48-503f-4d2b-be0e-5090cccd18f6",
    comments: [
      {
        text: "Commented 2",
        author: "Shalabh",
        creationTime: "2023-05-22T09:53:28.678Z",
      },
    ],
    creationTime: "2023-05-22T09:53:21.602Z",
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
        text: " is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type ",
      },
      {
        text: "specimen ",
        "commentThread_86dd7a48-503f-4d2b-be0e-5090cccd18f6": true,
      },
      {
        text: "book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and ",
      },
      {
        text: "more ",
        "commentThread_db982da7-8654-42fc-b840-af23aa6226fc": true,
      },
      {
        text: "recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    ],
  },
];

<template>
  <div>
    <div class="p-5">
      <div class="grid gap-5">
        <div class="grid grid-cols-6 gap-5">
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 398.2 409.6"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  d="M345.9 409.6H52.3C23.4 409.6 0 386.2 0 357.3v-198c0-6.3 5.1-11.4 11.4-11.4h375.5c6.3 0 11.4 5.1 11.4 11.4v56.9c0 6.3-5.1 11.4-11.4 11.4s-11.4-5.1-11.4-11.4v-45.5H22.8v186.6c0 16.3 13.2 29.5 29.5 29.5h293.6c16.3 0 29.5-13.2 29.5-29.5v-72.9c-.2-6.3 4.8-11.5 11-11.7 6.3-.2 11.5 4.8 11.7 11v73.6c.1 28.9-23.3 52.3-52.2 52.3zM117.1 108.1h-18c-17 0-30.8-13.8-30.8-30.8V30.8C68.3 13.8 82.1 0 99.1 0h18c17 0 30.8 13.8 30.8 30.8v46.5c0 17-13.8 30.8-30.8 30.8zm-18-85.3c-4.5 0-8.1 3.6-8.1 8v46.5c0 4.4 3.6 8.1 8.1 8.1h18c4.5 0 8.1-3.6 8.1-8.1V30.8c0-4.5-3.6-8.1-8.1-8.1h-18zm200 85.3h-18c-17 0-30.8-13.8-30.8-30.8V30.8c0-17 13.8-30.8 30.8-30.8h18c17 0 30.9 13.8 30.9 30.8v46.5c0 17-13.8 30.8-30.9 30.8zm-18-85.3c-4.4 0-8 3.6-8 8.1v46.5c0 4.4 3.6 8.1 8 8.1h18c4.5 0 8.1-3.6 8.1-8.1V30.8c0-4.4-3.6-8.1-8.1-8.1h-18z"
                ></path>
                <path
                  class="fill-primary-100"
                  d="M345.9 45.5h-27.4v31.8c0 10.7-8.7 19.4-19.4 19.4h-18c-10.7 0-19.4-8.7-19.4-19.4V45.5H136.5v31.8c0 10.7-8.7 19.4-19.4 19.4h-18c-10.7 0-19.4-8.7-19.5-19.4V45.5H52.3c-22.6 0-40.9 18.3-40.9 40.9v72.9h375.5V86.4c-.1-22.6-18.4-40.9-41-40.9z"
                ></path>
                <path
                  d="M386.8 170.7H11.4c-6.3 0-11.4-5.1-11.4-11.4V86.4c0-28.9 23.4-52.3 52.3-52.3h27.3c6.3 0 11.4 5.1 11.4 11.4v31.8c0 4.4 3.6 8.1 8.1 8.1h18c4.4 0 8.1-3.6 8.1-8.1V45.5c0-6.3 5.1-11.4 11.4-11.4h125.2c6.3 0 11.4 5.1 11.4 11.4v31.8c0 4.4 3.6 8.1 8 8.1h18c4.4 0 8.1-3.6 8.1-8.1V45.5c0-6.3 5.1-11.4 11.4-11.4h27.4c28.9 0 52.3 23.4 52.3 52.3v72.9c-.2 6.3-5.3 11.4-11.6 11.4zm-364-22.8h352.7V86.4c0-16.3-13.2-29.5-29.5-29.5h-16v20.4c0 17-13.8 30.8-30.8 30.8h-18c-17 0-30.8-13.8-30.8-30.8V56.9H147.9v20.4c0 17-13.8 30.8-30.8 30.8h-18c-17 0-30.8-13.8-30.8-30.8V56.9h-16c-16.3 0-29.5 13.2-29.5 29.5v61.5zM187 233.8l-6.8 4.2c-1.7 1.2-3.8 1.8-5.9 1.9-6.8 0-11.5-7.2-11.5-14.5-.1-5 2.5-9.8 6.8-12.4l30.9-18.7c2.1-1.2 4.4-1.7 6.8-1.6 7.5 0 16.1 4.4 16.1 11.5v148.7c0 7.5-9.1 11.2-18.2 11.2s-18.2-3.7-18.2-11.2V233.8z"
                ></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Reservations</span>
            <span class="text-4xl font-bold">{{ totalReservations }}</span>
          </div>
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 441.4 512"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  class="fill-green-100"
                  d="M254.9 457c-14.9-8.1-24.1-23.7-24.1-40.6V285.6c26.5 11.1 57.1 4.9 77.1-15.6-19-26.2-49.3-41.6-81.6-41.6H115.7c-55.7 0-100.9 45.2-100.9 100.9v167.9h312.4v-.8L254.9 457z"
                />
                <path
                  d="M426.6 270.8c-8.2 0-14.8 6.6-14.9 14.8v130.7c0 11.5-6.3 22.1-16.4 27.6l-66.7 36.3-66.6-36.3c-10.1-5.5-16.4-16.1-16.4-27.6V305c4.1.6 8.2.9 12.3.9 1.3 0 2.5 0 3.8-.1h1c1.1-.1 2.2-.1 3.4-.2l1.6-.2 1.6-.2c15-2 29.3-8 41.1-17.5l1.1-.9 1.3-1.1c.9-.7 1.7-1.5 2.5-2.2l.4-.4c1-.9 1.9-1.8 2.8-2.7 3.8-3.9 7.2-8.1 10.1-12.6 7.2 10.9 16.8 19.9 28 26.5 7.1 4.1 16.2 1.8 20.3-5.3 4.1-7.1 1.8-16.2-5.3-20.3-10-5.9-17.9-14.8-22.6-25.5-2.4-5.4-7.7-8.8-13.6-8.9h-13.5c-5.9 0-11.2 3.5-13.6 8.9-.5 1-.9 2-1.4 3-12.8-12.4-28.4-21.7-45.4-27.2 17.4-16.5 27.2-39.4 27.2-63.3V87.5c-.2-8.2-7-14.7-15.2-14.5-7.9.2-14.3 6.6-14.5 14.5v68.3c0 31.6-25.5 57.4-57.1 57.8h-62c-31.6-.5-57-26.2-57-57.8V87.5c0-31.9 25.9-57.8 57.8-57.8h60.5c8.2-.2 14.7-7 14.5-15.2-.2-7.9-6.6-14.3-14.5-14.5h-60.5C92.5.1 53.3 39.2 53.3 87.5v68.3c0 23.9 9.8 46.8 27.2 63.3C32.6 234.5.1 279 0 329.3v167.9c0 8.2 6.6 14.8 14.8 14.8h313.9c2.5 0 4.9-.6 7.1-1.8l73.8-40.2c19.6-10.7 31.9-31.3 31.9-53.6V285.6c-.1-8.2-6.7-14.8-14.9-14.8zM29.7 482.3v-153c.1-47.5 38.5-85.9 86-86h40.4v144.1c0 8.2 6.6 14.8 14.8 14.8s14.8-6.6 14.8-14.8V243.3h40.4c22.6 0 44.3 9 60.4 24.8-6.3 3.9-13.3 6.4-20.6 7.5h.1c-1.1.2-2.3.3-3.5.4l-.6.1c-1.2.1-2.5.1-3.7.1h-.2c-7.3 0-14.6-1.4-21.4-4.3-7.5-3.2-16.3.3-19.4 7.9-.8 1.8-1.2 3.8-1.2 5.8v130.7c0 22.4 12.2 42.9 31.8 53.7l22.6 12.3H29.7z"
                />
                <path
                  d="M327.2 405.9c-2.5 0-5-.6-7.2-1.9l-24.9-13.9c-7.2-4-9.7-13-5.7-20.2s13-9.7 20.2-5.7l15.7 8.7 34.1-30.1c6.1-5.4 15.5-4.9 21 1.3 5.4 6.1 4.9 15.5-1.3 21l-42 37.1c-2.8 2.4-6.3 3.7-9.9 3.7z"
                />
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Clients</span>
            <span class="text-4xl font-bold">{{ totalClients }}</span>
          </div>
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320.8 409.6"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  class="text-red-100"
                  d="M276.1 367.9v-8.5c0-63.6-52.1-115.7-115.7-115.7s-115.7 52-115.7 115.7v8.5c0 16.6 13.4 30 30 30h171.5c16.5 0 29.9-13.4 29.9-30z"
                />
                <path
                  d="M246.1 409.6H74.6c-23 0-41.7-18.7-41.7-41.7v-8.5c0-70.4 57.1-127.5 127.5-127.5S287.9 289 287.9 359.4v8.5c-.1 23-18.7 41.7-41.8 41.7zm-85.7-154.2c-57.4.1-103.9 46.6-104 104v8.5c0 10.1 8.2 18.2 18.2 18.2h171.5c10.1 0 18.2-8.2 18.2-18.2v-8.5c0-57.5-46.5-104-103.9-104zm145.5-109.9h-23.5c0-67.4-54.6-122-122-122s-122 54.6-122 122H14.9C14.9 65.3 80.2 0 160.4 0s145.5 65.3 145.5 145.5z"
                />
                <path
                  d="M160.4 251.3c-57 0-103.2-46.2-103.2-103.2S103.4 44.9 160.4 44.9s103.2 46.2 103.2 103.2c-.1 57-46.3 103.1-103.2 103.2zm0-182.9c-44 0-79.7 35.7-79.7 79.7s35.7 79.7 79.7 79.7 79.7-35.7 79.7-79.7c-.1-44-35.7-79.6-79.7-79.7z"
                />
                <path
                  class="text-red-100"
                  d="M68.3 130.4c0-5.6-2.9-10.8-7.6-13.8-15-9.4-34.7-4.9-44.1 10.1-3.2 5.1-4.9 11.1-4.9 17.1v21.5c0 17.7 14.4 32 32.1 32.1 6 0 11.8-1.7 16.9-4.9 4.7-3 7.6-8.2 7.6-13.8v-48.3z"
                />
                <path
                  d="M43.8 209.2C19.6 209.1 0 189.5 0 165.3v-21.5C0 119.6 19.5 100 43.7 100c8.2 0 16.3 2.3 23.3 6.7 8.2 5.1 13.1 14.1 13.1 23.8v48.4c.1 9.7-4.9 18.7-13.1 23.8-6.9 4.2-15 6.5-23.2 6.5zm0-85.8c-11.2 0-20.3 9.1-20.4 20.4v21.5c0 11.2 9.1 20.3 20.4 20.4 3.8 0 7.5-1.1 10.7-3.1 1.3-.9 2.1-2.3 2.1-3.9v-48.3c0-1.6-.8-3-2.1-3.9-3.2-2-6.9-3-10.7-3.1z"
                />
                <path
                  class="text-red-100"
                  d="M252.4 130.4c0-5.6 2.9-10.8 7.6-13.8 15-9.4 34.7-4.9 44.1 10.1 3.2 5.1 4.9 11.1 4.9 17.1v21.5c0 17.7-14.4 32-32.1 32.1-6 0-11.8-1.7-16.9-4.9-4.7-3-7.6-8.2-7.6-13.8v-48.3z"
                />
                <path
                  d="M276.9 209.2c-8.2 0-16.2-2.3-23.1-6.6-8.2-5.1-13.2-14.1-13.1-23.8v-48.4c-.1-9.7 4.9-18.7 13.1-23.8 20.5-12.8 47.5-6.6 60.3 13.9 4.4 7 6.7 15.1 6.7 23.3v21.5c0 24.2-19.6 43.8-43.9 43.9zm0-85.8c-3.8 0-7.5 1.1-10.7 3.1-1.3.9-2.1 2.3-2.1 3.9v48.4c0 1.6.8 3 2.1 3.9 9.5 5.9 22.1 3 28-6.5 2-3.2 3.1-7 3.1-10.8v-21.5c0-11.3-9.1-20.4-20.4-20.5z"
                />
                <path
                  d="M251.2 195.9h-83.3c-6.5 0-11.7-5.2-11.7-11.7s5.2-11.7 11.7-11.7h83.3c6.5 0 11.7 5.3 11.7 11.7 0 6.5-5.3 11.7-11.7 11.7z"
                />
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Agents</span>
            <span class="text-4xl font-bold">{{ totalAgents }}</span>
          </div>
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 398.2 409.6"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  d="M345.9 409.6H52.3C23.4 409.6 0 386.2 0 357.3v-198c0-6.3 5.1-11.4 11.4-11.4h375.5c6.3 0 11.4 5.1 11.4 11.4v56.9c0 6.3-5.1 11.4-11.4 11.4s-11.4-5.1-11.4-11.4v-45.5H22.8v186.6c0 16.3 13.2 29.5 29.5 29.5h293.6c16.3 0 29.5-13.2 29.5-29.5v-72.9c-.2-6.3 4.8-11.5 11-11.7 6.3-.2 11.5 4.8 11.7 11v73.6c.1 28.9-23.3 52.3-52.2 52.3zM117.1 108.1h-18c-17 0-30.8-13.8-30.8-30.8V30.8C68.3 13.8 82.1 0 99.1 0h18c17 0 30.8 13.8 30.8 30.8v46.5c0 17-13.8 30.8-30.8 30.8zm-18-85.3c-4.5 0-8.1 3.6-8.1 8v46.5c0 4.4 3.6 8.1 8.1 8.1h18c4.5 0 8.1-3.6 8.1-8.1V30.8c0-4.5-3.6-8.1-8.1-8.1h-18zm200 85.3h-18c-17 0-30.8-13.8-30.8-30.8V30.8c0-17 13.8-30.8 30.8-30.8h18c17 0 30.9 13.8 30.9 30.8v46.5c0 17-13.8 30.8-30.9 30.8zm-18-85.3c-4.4 0-8 3.6-8 8.1v46.5c0 4.4 3.6 8.1 8 8.1h18c4.5 0 8.1-3.6 8.1-8.1V30.8c0-4.4-3.6-8.1-8.1-8.1h-18z"
                ></path>
                <path
                  class="fill-yellow-100"
                  d="M345.9 45.5h-27.4v31.8c0 10.7-8.7 19.4-19.4 19.4h-18c-10.7 0-19.4-8.7-19.4-19.4V45.5H136.5v31.8c0 10.7-8.7 19.4-19.4 19.4h-18c-10.7 0-19.4-8.7-19.5-19.4V45.5H52.3c-22.6 0-40.9 18.3-40.9 40.9v72.9h375.5V86.4c-.1-22.6-18.4-40.9-41-40.9z"
                ></path>
                <path
                  d="M386.8 170.7H11.4c-6.3 0-11.4-5.1-11.4-11.4V86.4c0-28.9 23.4-52.3 52.3-52.3h27.3c6.3 0 11.4 5.1 11.4 11.4v31.8c0 4.4 3.6 8.1 8.1 8.1h18c4.4 0 8.1-3.6 8.1-8.1V45.5c0-6.3 5.1-11.4 11.4-11.4h125.2c6.3 0 11.4 5.1 11.4 11.4v31.8c0 4.4 3.6 8.1 8 8.1h18c4.4 0 8.1-3.6 8.1-8.1V45.5c0-6.3 5.1-11.4 11.4-11.4h27.4c28.9 0 52.3 23.4 52.3 52.3v72.9c-.2 6.3-5.3 11.4-11.6 11.4zm-364-22.8h352.7V86.4c0-16.3-13.2-29.5-29.5-29.5h-16v20.4c0 17-13.8 30.8-30.8 30.8h-18c-17 0-30.8-13.8-30.8-30.8V56.9H147.9v20.4c0 17-13.8 30.8-30.8 30.8h-18c-17 0-30.8-13.8-30.8-30.8V56.9h-16c-16.3 0-29.5 13.2-29.5 29.5v61.5zM187 233.8l-6.8 4.2c-1.7 1.2-3.8 1.8-5.9 1.9-6.8 0-11.5-7.2-11.5-14.5-.1-5 2.5-9.8 6.8-12.4l30.9-18.7c2.1-1.2 4.4-1.7 6.8-1.6 7.5 0 16.1 4.4 16.1 11.5v148.7c0 7.5-9.1 11.2-18.2 11.2s-18.2-3.7-18.2-11.2V233.8z"
                ></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Cars</span>
            <span class="text-4xl font-bold">{{ totalCars }}</span>
          </div>
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 409.6 400.7"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  class="text-green-100"
                  d="M238.7 258.9h-67.8c-22.3 0-40.5-18.1-40.5-40.4v-39.8h148.7v39.8c.1 22.3-18.1 40.4-40.4 40.4z"
                ></path>
                <path
                  d="M238.7 270.2h-67.8c-28.6 0-51.7-23.2-51.7-51.7v-39.8c0-6.2 5-11.3 11.3-11.3h148.7c6.2 0 11.3 5 11.3 11.3v39.8c-.1 28.5-23.2 51.6-51.8 51.7zm-97-80.3v28.6c0 16.1 13.1 29.2 29.2 29.2h67.8c16.1 0 29.2-13.1 29.2-29.2v-28.6H141.7z"
                ></path>
                <path
                  class="text-green-100"
                  d="M310.8 36.9l-22-22c-2.3-2.4-5.5-3.7-8.8-3.7H129.6c-3.3 0-6.4 1.3-8.8 3.6l-22 22c-2.3 2.3-3.6 5.5-3.6 8.8v79.6h219.2V45.7c0-3.3-1.3-6.4-3.6-8.8zm-40.7 77.4H139.5V58.9l3.4-3.3h124l3.4 3.3-.2 55.4z"
                ></path>
                <path
                  d="M314.4 136.6H95.2c-6.2 0-11.3-5-11.3-11.3V45.7c0-6.3 2.5-12.3 6.9-16.7l22-22c4.4-4.5 10.4-7 16.7-7H280c6.3 0 12.3 2.5 16.7 6.9l22 22c4.4 4.4 6.9 10.4 6.9 16.7v79.6c0 6.3-5 11.4-11.2 11.4zm-33-22.5h21.8V45.7c0-.3-.1-.6-.3-.8l-22-22c-.2-.2-.5-.3-.8-.3H129.6c-.3 0-.6.1-.8.3l-22 22c-.2.2-.3.5-.3.8v68.4h21.8V58.9c0-3 1.2-5.9 3.3-8l3.4-3.3c2.1-2.1 5-3.3 8-3.3h124c3 0 5.9 1.2 8 3.3l3.2 3.4c2.1 2.1 3.3 5 3.3 8l-.1 55.1zM150.7 103h108.1V66.8H150.7V103z"
                ></path>
                <path
                  d="M362.5 400.7H47c-25.9 0-47-21.1-47-47V137.8c0-26 21.1-47 47-47h315.5c26 0 47 21.1 47 47.1V194c.2 6.2-4.7 11.4-10.9 11.6-6.2.2-11.4-4.7-11.6-10.9v-56.9c0-13.5-11-24.5-24.5-24.5H47c-13.5 0-24.5 11-24.5 24.5v215.8c0 13.5 11 24.5 24.5 24.5h315.5c13.5 0 24.5-11 24.5-24.5V256c-.2-6.2 4.7-11.4 10.9-11.6 6.2-.2 11.4 4.7 11.6 10.9v98.3c.1 26-21 47-47 47.1z"
                ></path>
                <path
                  class="text-green-100"
                  d="M398.3 194v-56.2c0-19.8-16-35.8-35.7-35.8H47c-19.8 0-35.8 16-35.8 35.8V194h387.1z"
                ></path>
                <path
                  d="M398.3 205.3h-387C5 205.3 0 200.2 0 194v-56.2c0-26 21.1-47 47-47h315.5c26 0 47 21.1 47 47.1V194c.1 6.2-4.9 11.3-11.2 11.3zM22.5 182.7H387v-44.9c0-13.5-11-24.5-24.5-24.5H47c-13.5 0-24.5 11-24.5 24.5v44.9z"
                ></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Agences</span>
            <span class="text-4xl font-bold">{{ totalAgencies }}</span>
          </div>
          <div
            class="rounded-xl shadow-card overflow-hidden bg-white p-6 flex items-center justify-center flex-col"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 316.8 409.6"
                fill="currentColor"
                class="w-[45px] h-[45px]"
              >
                <path
                  class="fill-red-100"
                  d="M207.2 347.4h-97.6c-1.6 0-2 2-2 2.9 1.6 28.1 25.6 49.5 53.7 47.9 13.7-.8 26.4-7 35.4-17.4l.1-.2c.5-.5.9-1.1 1.4-1.6l.2-.3c.4-.5.8-1 1.2-1.6 0-.1.1-.1.1-.2.9-1.2 1.7-2.5 2.5-3.8l.1-.1c.4-.6.8-1.3 1.1-2 .7-1.4 1.4-2.8 2-4.3v-.1c.9-2.2 1.7-4.5 2.2-6.8l.3-1.2c.1-.4.2-.8.2-1.1.1-.2.1-.4.1-.6.2-1.1.4-2.2.5-3.3.1-.9.2-1.9.3-2.9v-1c0-1-.2-2.4-2-2.4l.2.1zM158.4 71.7c11.5 0 22.9 1.7 33.9 5V45.3c-.3-18.7-15.8-33.7-34.5-33.4-18.3.3-33 15.1-33.4 33.4v31.4c11.1-3.3 22.5-5 34-5z"
                />
                <path
                  d="M294.2 294.5v-91.2c0-62.2-37.8-115.1-90.5-134.8V45.3c0-24.9-20.2-45.2-45.2-45.2-25-.1-45.3 20.2-45.3 45.2v23.2c-52.7 19.7-90.6 72.7-90.6 134.8v91.2C9.8 296.6 0 307.7 0 321.1v9C0 344.9 12.1 357 26.9 357h70c4.6 30 30.5 52.6 61.5 52.6 18 0 35.1-7.8 47.1-21.3l.2-.2c.5-.6 1.1-1.3 1.6-1.9.2-.2.3-.3.4-.5.5-.6.9-1.3 1.4-1.9l.2-.3c1-1.5 2-3 2.9-4.5l.1-.2c.5-.8.9-1.5 1.3-2.3l.1-.2c.9-1.7 1.7-3.4 2.4-5.1l.1-.3c1.1-2.7 2-5.4 2.7-8.2l.3-1.2.1-.6c0-.3.1-.7.2-1.1 0-.3 0-.5.1-.8.1-.6.2-1.3.3-2h6.4v-22.6H26.9c-2.4 0-4.3-1.9-4.3-4.3v-9c0-2.4 1.9-4.3 4.3-4.3h263c2.4 0 4.3 1.9 4.3 4.3v9c0 2.4-1.9 4.3-4.3 4.3h-29.6V357h29.6c14.9 0 26.9-12.1 26.9-26.9v-9c0-13.3-9.8-24.5-22.6-26.6zm-97.9 64.3c-.4 1.2-.8 2.4-1.3 3.6l-.1.3c-.4 1-.9 2-1.4 3l-.2.4c-.2.4-.5.9-.7 1.3l-.1.2c-.6.9-1.2 1.8-1.9 2.8l-.1.2c-.3.3-.6.7-.9 1.1l-.3.3c-.4.4-.7.8-1.1 1.3l-.1.2c-4.9 5.6-11.3 9.7-18.4 11.8-20.9 6.3-43-5.7-49.2-26.6l75.8.1zM135.7 45.3c.3-12.2 10.1-21.9 22.2-22.2 12.5-.2 22.8 9.7 23.1 22.2v17c-4.6-.8-9.3-1.4-14-1.7h-.1c-.8-.1-1.6-.1-2.5-.1h-1.2c-.6 0-1.2 0-1.7-.1h-6.2c-.7 0-1.3 0-2 .1h-.8c-5.7.3-11.3.9-16.8 1.9V45.3zm135.9 248.9H45.3v-90.9c0-55.6 35.7-102.5 84-116.2.5-.1.9-.3 1.4-.4.6-.2 1.2-.3 1.7-.5.6-.1 1.2-.3 1.8-.4l1.5-.3c1-.2 2-.4 3.1-.6.4-.1.9-.2 1.3-.2.7-.1 1.5-.3 2.2-.4.4-.1.9-.1 1.3-.2l2.7-.3c.2 0 .5-.1.7-.1l3.3-.3c.4 0 .8-.1 1.2-.1.8-.1 1.6-.1 2.4-.1h1.2c1.1 0 2.2-.1 3.3-.1h.2c1.2 0 2.4 0 3.6.1h.7c1.1 0 2.1.1 3.2.2h.4c7.7.6 15.3 2 22.8 4.2l1.4.4c46.8 14.7 81.1 60.9 81.1 115.4v90.8z"
                />
                <path
                  d="M63 197.8h22.6c0-39.1 29.8-70.9 66.4-70.9v-22.6c-49.1 0-89 41.9-89 93.5z"
                />
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2">Alerts</span>
            <span class="text-4xl font-bold">{{ totalAlerts }}</span>
          </div>
        </div>
        <div class="rounded-xl shadow-card overflow-hidden bg-white">
          <div
            class="p-4 border-b flex items-center justify-between xs:flex-col xs:items-start xs:gap-2"
            :class="mode === 'dark' ? 'border-dark-50' : ''"
          >
            <span class="text-lg font-bold leading-none">Earnings</span>
          </div>
          <div>
            <apexchart
              type="line"
              height="500"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppCard from "../components/AppCard.vue";
import TopBar from "../components/TopBar.vue";
import VueApexCharts from "vue3-apexcharts";
export default {
  components: {
    AppCard,
    TopBar,
    apexchart: VueApexCharts,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      mode: localStorage.getItem("mode") || "light",
      chartOptions: {
        chart: {
          id: "vuechart-example",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        yaxis: {
          title: {
            text: "Earnings (د.م.)"
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value + " د.م.";
            }
          }
        }
      },
      series: [],
    };
  },
  computed: {
    totalReservations() {
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      return reservations.length;
    },
    totalClients() {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      return clients.length;
    },
    totalCars() {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      return cars.length;
    },
    totalAgents() {
      const agents = JSON.parse(localStorage.getItem('agents') || '[]');
      return agents.length;
    },
    totalAgencies() {
      const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      return agencies.length;
    },
    totalAlerts() {
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      return alerts.length;
    }
  },
  methods: {
    calculateCarEarnings() {
      try {
        const cars = JSON.parse(localStorage.getItem('cars') || '[]');
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        
        console.log('Cars:', cars);
        console.log('Reservations:', reservations);

        if (!cars.length) {
          console.log('No cars found in localStorage');
          this.series = [{
            name: 'No Data',
            data: Array(12).fill(0)
          }];
          return;
        }

        // Initialize monthly earnings for each car
        const monthlyEarnings = {};
        cars.forEach(car => {
          if (car && car.licensePlate) {
            monthlyEarnings[car.licensePlate] = Array(12).fill(0);
          }
        });

        // Calculate earnings for each reservation
        reservations.forEach(reservation => {
          if (!reservation || !reservation.startDate || !reservation.endDate || !reservation.carId) {
            console.log('Invalid reservation:', reservation);
            return;
          }

          const startDate = new Date(reservation.startDate);
          const endDate = new Date(reservation.endDate);
          const month = startDate.getMonth();
          const carId = reservation.carId;
          
          // Calculate number of days
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          
          // Find the car's daily rate
          const car = cars.find(c => c && c.licensePlate === carId);
          if (car && car.pricePerDay) {
            const earnings = days * car.pricePerDay;
            if (monthlyEarnings[carId]) {
              monthlyEarnings[carId][month] += earnings;
            }
          }
        });

        // Convert to series format for the chart
        const seriesData = cars
          .filter(car => car && car.licensePlate && car.name)
          .map(car => ({
            name: `${car.name}${car.model ? ' ' + car.model : ''}`,
            data: monthlyEarnings[car.licensePlate] || Array(12).fill(0)
          }));

        console.log('Series Data:', seriesData);

        if (seriesData.length === 0) {
          this.series = [{
            name: 'No Data',
            data: Array(12).fill(0)
          }];
        } else {
          this.series = seriesData;
        }
      } catch (error) {
        console.error('Error calculating car earnings:', error);
        this.series = [{
          name: 'Error',
          data: Array(12).fill(0)
        }];
      }
    }
  },
  mounted() {
    // Add test data to verify chart works
    this.series = [{
      name: 'Test Car',
      data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
    }];
    
    // Then calculate real data
    this.calculateCarEarnings();
  }
};
</script>

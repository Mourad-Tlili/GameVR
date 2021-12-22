FROM frolvlad/alpine-glibc:alpine-3.11_glibc-2.31

WORKDIR /app

COPY . .

ENTRYPOINT ["bash","deno"]

CMD [ "run", "--allow-net", "--allow-write", "--allow-read", "--allow-ffi", "--allow-env","--unstable" "/Tests/collect.ts" ]



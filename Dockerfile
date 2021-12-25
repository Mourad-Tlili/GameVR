FROM hayd/alpine-deno:1.0.0-rc2
WORKDIR /app

# These steps will be re-run upon each file change in your working directory:
COPY . ./

# Added to ENTRYPOINT of base image.
CMD [ "run", "--allow-net", "--allow-write", "--allow-read", "--allow-ffi", "--allow-env","--unstable" "/Tests/collect.ts" ]
---
title: "Stopping Docker Containers By Partial Name"
description: "I've been closing some gaps in my Docker CLI knowledge. Recently, I've been needing to stop a running container by name more often."
date: "2022-11-23"
tags: 
  - "docker"
  - "cli"
---

tl;dr: Add this to your `.zshrc` (or equivalent for your shell) and call it with `docker-stop-by-name part_of_my_container_name

```
docker-stop-by-name() {
    docker ps --filter name=$1 --format={{.ID}} | xargs docker stop
}
```

---

I've been closing some gaps in my Docker CLI knowledge. Recently, I've been needing to stop a running container by name more often. Usually, I would do this directly with [docker stop](https://docs.docker.com/engine/reference/commandline/stop/).

```
docker stop my_container_name
```

In this case part of the container's name is randomized. I don't know the full container name. Luckily, I can get that using the [`--filter`](https://docs.docker.com/engine/reference/commandline/ps/#filtering) option on [docker ps](https://docs.docker.com/engine/reference/commandline/ps/).

```
$ docker ps --filter name=my_container_name
CONTAINER ID   IMAGE     COMMAND                  CREATED      STATUS          PORTS                     NAMES
f131918121aa   mariadb   "/bin/sh -c 'echo Co…"   2 days ago   Up 10 minutes    0.0.0.0:3306->3306/tcp   my_container_name_123
```

I really just want the name though, so let's use the [`--format`](https://docs.docker.com/engine/reference/commandline/ps/#formatting) option to just get the container's ID.

```
$ docker ps --filter name=my_container_name --format={{.ID}}
f131918121aa
```

Now I have the ID of the container I want to stop, so I can use [xargs](https://en.wikipedia.org/wiki/Xargs) to turn that ID into the input to `docker stop`.

```
$ docker ps --filter name=my_container_name --format={{.ID}} | xargs docker stop
```

Finally, instead of having to remember that command every time I need it, I created an [alias with parameters](https://www.thorsten-hans.com/5-types-of-zsh-aliases#functions-for-aliases-with-parameters) in my `.zshrc` file.

```
docker-stop-by-name() {
    docker ps --filter name=$1 --format={{.ID}} | xargs docker stop
}
```

And now I can just type `docker-stop-by-name part_of_my_container_name` any time I need to stop a container full or partial name.
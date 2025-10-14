### Building and running your application

When you're ready, start your application by running:

```Bash
docker compose up --build --force-recreate`
```

**Please note:** You will require to comment/un-comment the respective prod/dev mode codes on the **compose.yaml** file

Your application will be available at http://localhost:5800.

### Deploying your application to the cloud

First, build your image, e.g.: 

```Bash
docker build -t myapp .
```

If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:

```Bash
docker build --platform=linux/amd64 -t myapp .
```

Then, push it to your registry, e.g. 

```Bash
docker push myregistry.com/myapp
```

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
# LaikaiVaikams3
The third refresh of the Laikai Vaikams site

## How to Use
LaikaiVaikams3 will work with any web server capable of executing PHP, as long as the root directory of the web server is set to the `public` directory. For a temporary lightweight server, use the `start_server.sh` script to start the PHP development server (requires PHP to be installed on your machine).

Going directly to the website will redirect you to the home page, from where the six monthly articles are  accessible.

Going to the URL `/generator/home/index.html` will send you to the "development version" pages, where you can access and edit in-dev articles and view them as they will appear when published.

### How to Publish

To publish in-dev articles, first create a file in the `editions` directory called `post_edition`. This is to prove that you are authorized to access the filesystem of the server and so are authorized to publish the in-dev articles.

This file must take the following form to be considered valid: `<name of the file holding the article data (e.g. 2019_rugsejo)>,<human-readable name of the edition (e.g. 2019 m. rugsejo)>` For example, the edition of rugsejis 2019 would require a `post_edition` file containing the text `2019_rugsejo,2019 m. rugsejo`.

To trigger the publishing system, after creating the `post_edition` with the correct contents, go to the URL `/generator/server_access/post_edition.php` in the website. If everything is set up correctly, the server should respond `Success`. If that happens, go back to the root of the website and the new edition should appear.

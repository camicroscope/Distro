
var url = "http://localhost:8080/select.php";


casper.test.begin('Link to flextables works fine', 3, function suite(test) {
    casper.start(url, function() {
        test.assertTitle("caMicroscope", "caMicroscope homepage title is the one expected");
        test.assertExists('a[href="FlexTables/index.php"]', "link to camicroscope is found");
        /*
        this.fill('form[action="/search"]', {
            q: "casperjs"
        }, true);
        */
        this.click('a[href="FlexTables/index.php"]');
    });

    casper.then(function() {

        test.assertTitle("Flex Tables", "Flextables works fine");

    });

    casper.run(function() {
        test.done();
    });
});

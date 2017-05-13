import {readDoc, assert, find} from './../util.js';

/** @test {ManualDocBuilder} */
describe('test manual', ()=>{
  describe('test navigation', ()=>{
    it('has manual link in header', ()=>{
      const doc = readDoc('index.html');
      assert.includes(doc, '[data-ice="manualHeaderLink"]', 'Manual');
      assert.includes(doc, '[data-ice="manualHeaderLink"]', './manual/index.html', 'href');
    });

    /** @test {ManualDocBuilder#_buildManualNav} */
    it('has manual navigation', ()=>{
      const doc = readDoc('manual/index.html');
      find(doc, '[data-ice="nav"]', (doc)=>{
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(1)', 'Overview Feature Demo License Author');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(2)', 'Design Concept Architecture Model');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(3)', 'Installation indent 2 indent 3 indent 4 indent 5');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(4)', 'Tutorial');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(5)', 'Usage');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(6)', 'Usage2 h2 in usage2 h3 in usage2');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(7)', 'Configuration');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(8)', 'Example Minimum Config Integration Test Code Into Documentation');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(9)', 'Advanced');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(10)', 'FAQ Goal');
        assert.includes(doc, '[data-ice="manual"]:nth-of-type(11)', 'Changelog 0.0.1');

        // overview
        find(doc, '[data-ice="manual"]:nth-of-type(1)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/overview.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/overview.html#feature', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(3) a', 'manual/overview.html#demo', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(4) a', 'manual/overview.html#license', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(5) a', 'manual/overview.html#author', 'href');
        });

        // design
        find(doc, '[data-ice="manual"]:nth-of-type(2)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/design.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/design.html#concept', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(3) a', 'manual/design.html#architecture', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(4) a', 'manual/design.html#model', 'href');
        });

        // installation
        find(doc, '[data-ice="manual"]:nth-of-type(3)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/installation.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/installation.html#indent-2', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(3) a', 'manual/installation.html#indent-3', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(4) a', 'manual/installation.html#indent-4', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(5) a', 'manual/installation.html#indent-5', 'href');
        });

        // tutorial
        find(doc, '[data-ice="manual"]:nth-of-type(4)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/tutorial.html', 'href');
        });

        // usage1
        find(doc, '[data-ice="manual"]:nth-of-type(5)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/usage1.html', 'href');
        });

        // usage2
        find(doc, '[data-ice="manual"]:nth-of-type(6)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/usage2.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/usage2.html#h2-in-usage2', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(3) a', 'manual/usage2.html#h3-in-usage2', 'href');
        });

        // configuration
        find(doc, '[data-ice="manual"]:nth-of-type(7)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/configuration.html', 'href');
        });

        // example
        find(doc, '[data-ice="manual"]:nth-of-type(8)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/example.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/example.html#minimum-config', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(3) a', 'manual/example.html#integration-test-code-into-documentation', 'href');
        });

        // advanced
        find(doc, '[data-ice="manual"]:nth-of-type(9)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/advanced.html', 'href');
        });

        // faq
        find(doc, '[data-ice="manual"]:nth-of-type(10)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/faq.html', 'href');
        });

        // changelog
        find(doc, '[data-ice="manual"]:nth-of-type(11)', (doc)=>{
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(1) a', 'manual/CHANGELOG.html', 'href');
          assert.includes(doc, '[data-ice="manualNav"]:nth-of-type(2) a', 'manual/CHANGELOG.html#0-0-1', 'href');
        });
      });
    });
  });

  /** @test {ManualDocBuilder#_buildManualIndex} */
  describe('test each heading tags', ()=>{
    const doc = readDoc('manual/index.html');

    it('has overview heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(1)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/overview.html', 'href');
      });
    });

    it('has design heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(2)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/design.html', 'href');
      });
    });

    it('has installation heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(3)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/installation.html', 'href');
      });
    });

    it('has tutorial heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(4)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/tutorial.html', 'href');
      });
    });

    it('has usage heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(5)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/usage1.html', 'href');
      });
    });

    it('has usage2 heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(6)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/usage2.html', 'href');
      });
    });

    it('has configuration heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(7)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/configuration.html', 'href');
      });
    });

    it('has example heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(8)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/example.html', 'href');
      });
    });

    it('has advanced heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(9)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/advanced.html', 'href');
      });
    });

    it('has faq heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(10)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/faq.html', 'href');
      });
    });

    it('has changelog heading tags', ()=>{
      find(doc, '.manual-card-wrap:nth-of-type(11)', (doc)=>{
        assert.includes(doc, '.manual-card > a', 'manual/CHANGELOG.html', 'href');
      });
    });
  });

  /** @test {ManualDocBuilder#_buildManual} */
  describe('test each manual', ()=>{
    it('has overview', ()=>{
      const doc = readDoc('manual/overview.html');
      assert.includes(doc, '.github-markdown h1', 'Overview');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'ESDoc is a documentation generator for JavaScript(ES6).');
    });

    it('has installation', ()=>{
      const doc = readDoc('manual/installation.html');
      assert.includes(doc, '.github-markdown h1', 'Installation');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'npm install -g esdoc');
    });

    it('has usage', ()=>{
      const doc = readDoc('manual/usage1.html');
      assert.includes(doc, '.github-markdown h1:nth-of-type(1)', 'Usage');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'esdoc -c esdoc.json');
    });

    it('has tutorial', ()=>{
      const doc = readDoc('manual/tutorial.html');
      assert.includes(doc, '.github-markdown h1', 'Tutorial');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'this is tutorial');
    });

    it('has configuration', ()=>{
      const doc = readDoc('manual/configuration.html');
      assert.includes(doc, '.github-markdown h1', 'Configuration');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'this is configuration');
    });

    it('has example', ()=>{
      const doc = readDoc('manual/example.html');
      assert.includes(doc, '.github-markdown h1', 'Example');
      assert.includes(doc, '.github-markdown[data-ice="content"] h2:nth-of-type(1)', 'Minimum Config');
    });

    it('has faq', ()=>{
      const doc = readDoc('manual/faq.html');
      assert.includes(doc, '.github-markdown h1', 'FAQ');
      assert.includes(doc, '.github-markdown[data-ice="content"]', 'ESDoc has two goals.');
    });

    it('has changelog', ()=>{
      const doc = readDoc('manual/CHANGELOG.html');
      assert.includes(doc, '.github-markdown h1', 'Changelog');
      assert.includes(doc, '.github-markdown[data-ice="content"] h2:nth-of-type(1)', '0.0.1');
    });
  });
});

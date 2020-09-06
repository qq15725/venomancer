<?php

namespace Wxm\Venomancer;

use Symfony\Component\Process\Process;

class Server
{
    /**
     * @var Container
     */
    protected $app;

    /**
     * @var array
     */
    protected $options = [
        // Node's executable path
        'executable_path' => 'node',

        // Enables debugging mode:
        //   - adds the --inspect flag to Node's command
        //   - appends stack traces to Node exception messages
        'debug' => false,
    ];

    /**
     * The running process.
     *
     * @var \Symfony\Component\Process\Process
     */
    protected $process;

    /**
     * The PID of the running process.
     *
     * @var int
     */
    protected $processPid;

    /**
     * The server port.
     *
     * @var int
     */
    protected $serverPort;

    /**
     * Server constructor.
     *
     * @param Container $app
     */
    public function __construct(Container $app)
    {
        $this->app = $app;

        $this->applyOptions((array)$this->app->config->get('server', []));
    }

    /**
     * Apply the options.
     */
    protected function applyOptions(array $options): void
    {
        $this->options = array_merge($this->options, $options);
    }

    /**
     * @return string
     */
    public function getScriptPath(): string
    {
        $scriptPath = dirname(__DIR__) . '/packages/venomancer/bin/venomancer.js';

        $process = new Process([
            $this->options['executable_path'],
            '-e',
            "process.stdout.write(require.resolve('venomancer/bin/venomancer.js'))",
        ]);

        $exitCode = $process->run();

        if ($exitCode === 0) {
            $scriptPath = $process->getOutput();
        }

        return $scriptPath;
    }

    /**
     * @param string $connectionDelegatePath
     *
     * @return Process
     */
    protected function createNewProcess(): Process
    {
        return new Process(
            array_merge(
                [$this->options['executable_path']],
                $this->options['debug'] ? ['--inspect'] : [],
                [$this->getScriptPath()],
                ["--port={$this->options['port']}"]
            ),
            null,
            ['DEBUG_HIDE_DATE' => 'yes']
        );
    }

    /**
     * @param Process $process
     *
     * @return int|null
     */
    protected function startProcess(Process $process)
    {
        $process->setTimeout(null);

        $process->start();

        return $process->getPid();
    }

    public function serve()
    {
        $this->process = $this->createNewProcess();

        $this->processPid = $this->startProcess($this->process);

        $this->serverPort = $this->options['port'];

        $this->process->wait(function ($type, $buffer) {
            $buffer = rtrim($buffer, "\n");
            if (Process::ERR == $type) {
                $this->app->logger->info($buffer);
            } else {
                $matches = [];
                if (preg_match('#Download Chromium (.*)#', $buffer, $matches)) {
                    echo $buffer . PHP_EOL;
                } else {
                    $this->app->logger->error($buffer);
                }
            }
        });
    }
}


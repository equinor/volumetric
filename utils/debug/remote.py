def enable_remote_debugging(
        server='172.17.0.1',
        port=21000,
        egg_path='/code/utils/debug/pycharm-debug-py3k.egg'):
    import sys

    sys.path.append(egg_path)
    import pydevd

    try:
        pydevd.settrace(
            server,
            port=port,
            stdoutToServer=True,
            stderrToServer=True,
            suspend=False)
    except Exception as e:
        print("Enable remote debugging failed: " + str(e))
